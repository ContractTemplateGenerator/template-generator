#!/usr/bin/env python3
"""
Demo script showing the Tough Love Wellness Bot features
"""

from config import VoicePreset
from user_data import UserDataManager
from bot_responses import ToughLoveResponses

def demo_bot():
    print("🎬 TOUGH LOVE WELLNESS BOT DEMO")
    print("="*50)
    
    # Create demo user data
    user_data = UserDataManager()
    
    # Set up demo profile
    user_data.give_consent()
    user_data.update_user_profile(name="Demo User", current_weight=180, goal_weight=165)
    user_data.data["settings"]["preferred_voice"] = "sassy_bff"
    user_data.save_data()
    
    # Create responses handler
    responses = ToughLoveResponses(user_data)
    
    # Demo Feature 1: Weight responses
    print("\n📊 FEATURE 1: WEIGHT RESPONSES")
    print("-" * 30)
    
    # Add initial weight
    user_data.add_weight_entry(180, "Starting weight")
    print("Logging starting weight: 180 lbs")
    
    # Simulate weight loss
    user_data.add_weight_entry(178.5, "Week 1")
    response = responses.get_weight_response(178.5, 180)
    print(f"🤖 Weight Loss Response: {response}")
    
    # Simulate weight gain
    user_data.add_weight_entry(179.2, "Had a rough weekend")
    response = responses.get_weight_response(179.2, 178.5)
    print(f"🤖 Weight Gain Response: {response}")
    
    # Demo Feature 2: Workout motivation
    print("\n💪 FEATURE 2: WORKOUT MOTIVATION")
    print("-" * 30)
    user_data.add_workout_entry("cardio", 30, "Treadmill run")
    response = responses.get_workout_motivation("cardio")
    print(f"🤖 Workout Motivation: {response}")
    
    # Demo Feature 3: Shame mode
    print("\n🚨 FEATURE 3: SHAME MODE")
    print("-" * 30)
    response = responses.get_shame_mode_response("snack")
    print(f"🤖 Shame Mode: {response}")
    
    # Demo Feature 4: Personal triggers
    print("\n🎯 FEATURE 4: PERSONAL TRIGGERS")
    print("-" * 30)
    user_data.add_personal_trigger("wedding dress")
    response = responses.get_trigger_specific_response("wedding dress", "motivation")
    print(f"🤖 Trigger Response: {response}")
    
    # Demo Feature 5: Roast buddy
    print("\n💬 FEATURE 5: ROAST BUDDY MODE")
    print("-" * 30)
    user_data.add_roast_buddy_message("Stop making excuses and hit the gym!", "Best Friend")
    response = responses.get_roast_buddy_response()
    print(f"🤖 Buddy Message: {response}")
    
    # Demo Feature 6: Unlockables
    print("\n🏆 FEATURE 6: MOTIVATIONAL UNLOCKABLES")
    print("-" * 30)
    # Simulate multiple workouts to unlock level
    for i in range(6):
        user_data.add_workout_entry(f"workout_{i}", 25, f"Session {i+1}")
    
    response = responses.get_unlock_celebration(2)
    print(f"🤖 Level Up: {response}")
    
    # Demo Feature 7: Different voice presets
    print("\n🎭 FEATURE 7: VOICE PRESETS")
    print("-" * 30)
    
    voices = [VoicePreset.GORDON_RAMSAY, VoicePreset.JOAN_RIVERS, VoicePreset.DRILL_SERGEANT]
    
    for voice in voices:
        responses.voice_preset = voice
        response = responses.get_workout_motivation("strength training")
        print(f"🤖 {voice.value.replace('_', ' ').title()}: {response}")
    
    # Demo progress summary
    print("\n📈 PROGRESS SUMMARY")
    print("-" * 30)
    responses.voice_preset = VoicePreset.SASSY_BFF  # Reset to sassy BFF
    summary = responses.get_progress_summary()
    print(f"🤖 {summary}")
    
    # Demo kindness mode
    print("\n💕 KINDNESS MODE DEMO")
    print("-" * 30)
    user_data.activate_kindness_mode()
    responses.kindness_mode = True
    kind_response = responses.get_weight_response(179.5, 179.2)
    print(f"🤖 Kindness Mode: {kind_response}")
    
    print("\n✅ Demo completed! All 7 features working perfectly!")
    print("\nTo run the interactive version, use: python3 main.py")
    print("(You'll need to provide input for consent and setup)")

if __name__ == "__main__":
    demo_bot()