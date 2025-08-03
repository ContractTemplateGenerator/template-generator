# 🤖 Tough Love Wellness Bot

A humorous, self-motivational wellness accountability assistant that uses sarcastic, comedic tough love to help you achieve your fitness goals. This bot provides affectionate teasing mixed with actionable motivation - never targeting others, only speaking to the consenting user.

## ⚠️ Important Disclaimer

This bot uses **sarcastic humor and playful roasting** as motivation. It includes:
- Comedic commentary on your progress
- Tough love messaging style
- Customizable intensity levels
- **Built-in kindness mode** for supportive messages
- Full consent verification system

**This is for entertainment and motivation only. You can adjust settings or quit anytime.**

## 🎯 Features

### 1. 📊 Daily Weigh-In Responses
Log your weight and receive personalized commentary with progress tracking:
- **Weight loss**: "YES QUEEN! 2.3 pounds down! You're absolutely slaying this!"
- **Weight gain**: "Girl, 1.5 pounds? We need to talk about your relationship with snacks."
- **Stable weight**: "Same weight? Plateau vibes, but we're not giving up!"

### 2. 🔔 Push Notification Reminders
Periodic motivational messages throughout the day:
- **Morning motivation**: "Rise and grind, bestie! Your goals aren't going to achieve themselves!"
- **Snack attack prevention**: "Step away from the fridge! This is not the ending you want for your hero's journey!"
- **Workout reminders**: "Did someone say leg day? No? Too bad, go do it anyway."

### 3. 🚨 Shame Mode Panic Button
Emergency motivation when you're tempted to break your goals:
- "GIRL. STOP. We need to have a serious conversation right now!"
- "Really? A fifth cookie? Should I go ahead and order the forklift now?"
- "You worked hard for those almost-visible abs. Don't betray them now."

### 4. 🎯 Personal Trigger List
Add specific goals or items for personalized responses:
- "Remember that wedding dress? It deserves better than your current lifestyle choices."
- "Think about that beach vacation! Is this moment worth giving up on that dream?"

### 5. 💬 Trusted Roast Buddy Mode
Friends/partners can add motivational messages delivered through your chosen voice:
- Messages from trusted people wrapped in comedic delivery
- Full consent system for message approval

### 6. 🏆 Motivational Unlockables
Unlock premium content as you hit goals:
- **Level 1**: Beginner roasts (0+ workouts)
- **Level 2**: Intermediate sass (5+ workouts)
- **Level 3**: Advanced mockery (15+ workouts)
- **Level 4**: Expert-level roasts (30+ workouts)
- **Level 5**: Legendary tough love (50+ workouts)

### 7. 🎭 Voice/Tone Selector
Choose from multiple personality presets:

#### 🔥 Gordon Ramsay (Raging Chef)
- "Bloody hell! Up 2 pounds? What have you been doing, taste-testing everything?"
- "BRILLIANT! 3 pounds down! Now that's what I call proper execution!"

#### 💎 Joan Rivers (Savage Glam)
- "Oh honey, gained weight? Can we talk? Because clearly someone's been talking to the fridge too much."
- "Fabulous! 2 pounds down! You're becoming positively glamorous!"

#### 👯‍♀️ Sassy Best Friend
- "Bestie, step away from the snacks! We talked about this!"
- "YES QUEEN! You're out here making it look easy!"

#### 🪖 Drill Sergeant
- "DROP AND GIVE ME TWENTY! Those pounds didn't disappear from discipline!"
- "OUTSTANDING! That's what military precision looks like!"

#### 👩‍👧‍👦 Passive-Aggressive Mom
- "Well, gained weight... I suppose that's what happens when we make 'choices.'"
- "Oh my, lost weight! Maybe you were listening to my advice after all."

## 🛡️ Safety Features

- **🤗 Kindness Override**: Toggle to supportive mode anytime
- **📊 Consent System**: Full verification before tough love begins
- **🔧 Intensity Levels**: Gentle, Medium, or Savage options
- **❌ Exit Anytime**: No judgment for stopping
- **🎯 Self-Referential Only**: Never targets others, only motivates you

## 📁 Project Structure

```
tough-love-wellness-bot/
├── main.py              # Main application with CLI interface
├── bot_responses.py     # All response messages and logic
├── user_data.py         # User data management and JSON persistence
├── config.py            # Configuration settings and voice presets
├── requirements.txt     # Dependencies (uses standard library only)
├── README.md            # This documentation
├── user_data.json       # User data storage (created automatically)
└── bot_config.json      # Bot configuration (created automatically)
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- No external dependencies required (uses Python standard library)

### Installation Steps

1. **Clone or download the project**:
   ```bash
   cd /Users/mac/Documents/GitHub/template-generator/tough-love-wellness-bot/
   ```

2. **Make the main script executable** (optional):
   ```bash
   chmod +x main.py
   ```

3. **Run the bot**:
   ```bash
   python main.py
   ```
   or
   ```bash
   python3 main.py
   ```

### First-Time Setup

When you first run the bot, it will:

1. **Request consent** for tough love messaging
2. **Set up your profile** (name, weight, goals)
3. **Choose your voice preference** from 5 personality options
4. **Configure intensity level** (Gentle/Medium/Savage)

## 🎮 Usage Guide

### Main Menu Options

```
🏋️  TOUGH LOVE WELLNESS BOT MENU  🏋️
1. 📊 Log weight
2. 💪 Log workout  
3. 🚨 SHAME MODE (emergency motivation)
4. 🎯 Add personal trigger
5. 💬 Add roast buddy message
6. 📈 View progress
7. ⚙️  Settings
8. 💕 Toggle kindness mode
9. 🔔 Get motivation reminder
10. ❓ Help
0. 👋 Quit
```

### Example Workflow

1. **Log your starting weight**:
   ```
   Choose: 1 (Log weight)
   Enter weight: 180
   Bot: "First weigh-in! No judgment here, just excited to watch you glow up!"
   ```

2. **Add a personal trigger**:
   ```
   Choose: 4 (Add personal trigger)
   Enter trigger: "wedding dress"
   Bot: "Added trigger: 'wedding dress'. I'll reference this in future motivation!"
   ```

3. **Log a workout**:
   ```
   Choose: 2 (Log workout)
   Workout type: cardio
   Duration: 30
   Bot: "Come on, queen! Cardio time! Let's get that glow!"
   ```

4. **Use Shame Mode when tempted**:
   ```
   Choose: 3 (SHAME MODE)
   Temptation: snack
   Bot: "GIRL. STOP. We need to have a serious conversation right now!"
   ```

## ⚙️ Configuration

### Voice Personalities
Change your bot's personality anytime through Settings → Change voice personality

### Intensity Levels
- **Gentle (1)**: Family-friendly, encouraging
- **Medium (2)**: Standard sass and humor  
- **Savage (3)**: Maximum roast mode

### Kindness Mode
Toggle between tough love and supportive messaging:
- **ON**: Gentle, encouraging responses
- **OFF**: Sarcastic, tough love responses

## 📊 Data Storage

All data is stored locally in JSON files:

- **`user_data.json`**: Your personal data, progress, and settings
- **`bot_config.json`**: Bot configuration and preferences

### Data Privacy
- All data stays on your local machine
- No external servers or cloud storage
- You control your data completely

## 🔧 Customization

### Adding New Voice Presets
Edit `config.py` to add new personalities:

```python
VOICE_CHARACTERISTICS = {
    VoicePreset.YOUR_NEW_VOICE: {
        "name": "Your Voice Name",
        "description": "Voice description",
        "catchphrases": ["Phrase 1", "Phrase 2"],
        "style": "voice style description"
    }
}
```

### Modifying Responses
Edit `bot_responses.py` to customize messages for each feature and voice combination.

## 🧪 Testing

Run the bot in different scenarios:

1. **Test weight logging** with gains, losses, and stable weight
2. **Try different voice personalities** to find your favorite
3. **Use Shame Mode** when facing real temptations
4. **Add personal triggers** for customized motivation
5. **Toggle between tough love and kindness mode**

## 🐛 Troubleshooting

### Common Issues

**"Permission denied" error**:
```bash
chmod +x main.py
python main.py
```

**"Module not found" error**:
Ensure you're in the correct directory:
```bash
cd /Users/mac/Documents/GitHub/template-generator/tough-love-wellness-bot/
python main.py
```

**Data not saving**:
Check file permissions in the project directory.

### Reset Everything
If you want to start fresh:
1. Go to Settings → Reset all data
2. Type "DELETE EVERYTHING" to confirm
3. Restart the application

## 🤝 Contributing

This is a template project for educational purposes. Feel free to:

- Add new voice personalities
- Create additional features
- Improve the user interface
- Add unit tests
- Enhance data visualization

## 📜 License

This project is for educational and personal use. Modify and distribute as needed.

## 🙏 Acknowledgments

- Inspired by accountability apps and motivational coaching
- Designed for entertainment and positive motivation
- Built with Python standard library for simplicity

---

**Remember**: This bot is designed to motivate through humor. If you ever feel uncomfortable, use kindness mode or adjust the settings. Your mental health and well-being are the real priorities! 💕

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the help menu within the app (option 10)
3. Modify the code to suit your needs
4. Remember: you can always toggle kindness mode! 

**Have fun and stay motivated!** 🎉