#!/usr/bin/env python3
"""
Extract all published posts from WordPress SQL backup and create JSON index.
"""
import re
import json
from datetime import datetime
from pathlib import Path
from html import unescape
import urllib.parse

SQL_DIR = Path(__file__).parent / "WP-backup/sql"
OUTPUT_FILE = Path(__file__).parent / "posts-data.js"

def parse_sql_values(sql_content, table_name):
    """Parse INSERT statements from SQL file."""
    pattern = rf"INSERT INTO `{table_name}`.*?VALUES\s*"
    matches = re.split(pattern, sql_content)

    rows = []
    for match in matches[1:]:  # Skip first empty match
        # Find all value tuples
        tuple_pattern = r"\(([^)]+)\)"
        tuples = re.findall(tuple_pattern, match, re.DOTALL)
        for t in tuples:
            # Parse individual values
            values = []
            current = ""
            in_string = False
            escape_next = False

            for char in t:
                if escape_next:
                    current += char
                    escape_next = False
                elif char == '\\':
                    current += char
                    escape_next = True
                elif char == "'" and not in_string:
                    in_string = True
                elif char == "'" and in_string:
                    in_string = False
                elif char == ',' and not in_string:
                    values.append(current.strip().strip("'"))
                    current = ""
                else:
                    current += char

            if current.strip():
                values.append(current.strip().strip("'"))

            if values:
                rows.append(values)

    return rows

def extract_posts():
    """Extract published posts from wp_posts.sql"""
    print("Reading wp_posts.sql...")
    posts_sql = (SQL_DIR / "wp_posts.sql").read_text(encoding='utf-8', errors='ignore')

    posts = {}
    # Simpler regex approach - find each INSERT and extract key fields
    # Format: ID, post_author, post_date, ..., post_title, ..., post_status, ..., post_name, ..., post_type

    # Match individual rows in VALUES
    pattern = r"VALUES \((\d+),(\d+),'([^']*?)','([^']*?)','(.*?)','(.*?)','(.*?)','(publish|draft|private)','[^']*?','[^']*?','[^']*?','([^']*?)',"

    for match in re.finditer(pattern, posts_sql):
        post_id = int(match.group(1))
        post_date = match.group(3)
        post_title = match.group(6)
        post_status = match.group(8)
        post_name = match.group(9)  # This is the slug

        if post_status == 'publish':
            # Clean up title
            post_title = unescape(post_title.replace("\\'", "'").replace("\\n", " ").strip())

            # Build URL from date and slug
            try:
                dt = datetime.strptime(post_date[:10], '%Y-%m-%d')
                url = f"https://terms.law/{dt.year}/{dt.month:02d}/{dt.day:02d}/{post_name}/"
            except:
                url = f"https://terms.law/{post_name}/"

            posts[post_id] = {
                'id': post_id,
                'title': post_title,
                'slug': post_name,
                'date': post_date[:10],
                'url': url,
                'categories': []
            }

    print(f"Found {len(posts)} published posts")
    return posts

def extract_terms():
    """Extract category terms from wp_terms.sql and wp_term_taxonomy.sql"""
    print("Reading wp_terms.sql...")
    terms_sql = (SQL_DIR / "wp_terms.sql").read_text(encoding='utf-8', errors='ignore')

    print("Reading wp_term_taxonomy.sql...")
    taxonomy_sql = (SQL_DIR / "wp_term_taxonomy.sql").read_text(encoding='utf-8', errors='ignore')

    # Extract terms: term_id -> name
    terms = {}
    term_pattern = r"VALUES \((\d+),'([^']*?)','([^']*?)',\d+\)"
    for match in re.finditer(term_pattern, terms_sql):
        term_id = int(match.group(1))
        name = unescape(match.group(2).replace("\\'", "'"))
        slug = match.group(3)
        terms[term_id] = {'name': name, 'slug': slug}

    # Extract taxonomies: term_taxonomy_id -> term_id (for categories only)
    taxonomy_to_term = {}
    tax_pattern = r"VALUES \((\d+),(\d+),'(category|post_tag)',"
    for match in re.finditer(tax_pattern, taxonomy_sql):
        term_taxonomy_id = int(match.group(1))
        term_id = int(match.group(2))
        taxonomy_type = match.group(3)
        if taxonomy_type == 'category' and term_id in terms:
            taxonomy_to_term[term_taxonomy_id] = terms[term_id]

    print(f"Found {len(taxonomy_to_term)} category taxonomies")
    return taxonomy_to_term

def extract_relationships(posts, taxonomy_to_term):
    """Link posts to their categories via wp_term_relationships.sql"""
    print("Reading wp_term_relationships.sql...")
    rel_sql = (SQL_DIR / "wp_term_relationships.sql").read_text(encoding='utf-8', errors='ignore')

    # object_id (post_id), term_taxonomy_id
    rel_pattern = r"VALUES \((\d+),(\d+),\d+\)"
    for match in re.finditer(rel_pattern, rel_sql):
        post_id = int(match.group(1))
        term_taxonomy_id = int(match.group(2))

        if post_id in posts and term_taxonomy_id in taxonomy_to_term:
            cat_info = taxonomy_to_term[term_taxonomy_id]
            if cat_info['name'] not in posts[post_id]['categories']:
                posts[post_id]['categories'].append(cat_info['name'])

    return posts

def main():
    # Extract all data
    posts = extract_posts()
    taxonomy_to_term = extract_terms()
    posts = extract_relationships(posts, taxonomy_to_term)

    # Convert to list and sort by date (newest first)
    posts_list = sorted(posts.values(), key=lambda x: x['date'], reverse=True)

    # Gather unique categories
    all_categories = set()
    for post in posts_list:
        all_categories.update(post['categories'])

    print(f"\nTotal posts: {len(posts_list)}")
    print(f"Categories: {sorted(all_categories)}")

    # Write to JavaScript file
    output = f"""// Auto-generated blog posts data
// Generated: {datetime.now().isoformat()}
// Total posts: {len(posts_list)}

const BLOG_POSTS = {json.dumps(posts_list, indent=2, ensure_ascii=False)};

const BLOG_CATEGORIES = {json.dumps(sorted(all_categories), indent=2, ensure_ascii=False)};
"""

    OUTPUT_FILE.write_text(output, encoding='utf-8')
    print(f"\nWrote {OUTPUT_FILE}")

    # Also write a sample for verification
    print("\nSample posts:")
    for post in posts_list[:5]:
        print(f"  - {post['title'][:60]}... ({post['date']}) [{', '.join(post['categories'][:2])}]")

if __name__ == "__main__":
    main()
