"""Bot response logic and messages for all features"""

import random
from typing import Dict, List, Optional, Any
from config import VoicePreset, IntensityLevel, VOICE_CHARACTERISTICS
from user_data import UserDataManager

class ToughLoveResponses:
    def __init__(self, user_data: UserDataManager):
        self.user_data = user_data
        self.voice_preset = VoicePreset(user_data.data["settings"]["preferred_voice"])
        self.intensity = user_data.data["settings"]["intensity_level"]
        self.kindness_mode = user_data.data["settings"]["kindness_mode"]
    
    def _get_voice_style(self) -> Dict[str, Any]:
        return VOICE_CHARACTERISTICS[self.voice_preset]
    
    def _apply_intensity_filter(self, responses: List[str]) -> List[str]:
        if self.intensity == 1:  # Gentle
            return [r for r in responses if "damn" not in r.lower() and "hell" not in r.lower()]
        elif self.intensity == 2:  # Medium
            return responses
        else:  # Savage
            return responses + [r + " And that's the truth!" for r in responses[-2:]]
    
    def _get_kindness_response(self, context: str) -> str:
        kindness_responses = {
            "weight_gain": "You're doing great! Weight fluctuates naturally. Keep focusing on your healthy habits.",
            "weight_loss": "Fantastic progress! You should be proud of your dedication and hard work.",
            "workout_motivation": "You've got this! Every step towards your goal is progress worth celebrating.",
            "shame_button": "Hey, it's okay to have challenging moments. You're human and you're trying your best.",
            "reminder": "Gentle reminder that you're on a journey to better health. Be kind to yourself today."
        }
        return kindness_responses.get(context, "You're doing amazing! Keep up the great work!")

    # Feature 1: Daily Weigh-In Responses
    def get_weight_response(self, current_weight: float, previous_weight: Optional[float] = None) -> str:
        if self.kindness_mode:
            if previous_weight and current_weight < previous_weight:
                return self._get_kindness_response("weight_loss")
            else:
                return self._get_kindness_response("weight_gain")
        
        progress = self.user_data.get_weight_progress()
        triggers = self.user_data.get_personal_triggers()
        
        if previous_weight:
            weight_change = current_weight - previous_weight
            
            if weight_change > 0:  # Weight gain
                responses = self._get_weight_gain_responses(weight_change, triggers)
            elif weight_change < 0:  # Weight loss
                responses = self._get_weight_loss_responses(abs(weight_change), triggers, progress)
            else:  # No change
                responses = self._get_weight_stable_responses()
        else:
            responses = self._get_first_weigh_in_responses()
        
        filtered_responses = self._apply_intensity_filter(responses)
        return random.choice(filtered_responses)
    
    def _get_weight_gain_responses(self, gain: float, triggers: List[str]) -> List[str]:
        voice_style = self._get_voice_style()
        
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            responses = [
                f"Bloody hell! Up {gain:.1f} pounds? What have you been doing, taste-testing everything?",
                f"You muppet! The scale doesn't lie - {gain:.1f} pounds means you've been slacking!",
                f"This is a disaster! {gain:.1f} pounds? Get back in that kitchen and make better choices!",
                f"Raw! Just like your willpower apparently. {gain:.1f} pounds of pure disappointment!"
            ]
        elif self.voice_preset == VoicePreset.JOAN_RIVERS:
            responses = [
                f"Oh honey, {gain:.1f} pounds? Can we talk? Because clearly someone's been talking to the fridge too much.",
                f"Seriously? {gain:.1f} pounds? I've seen less dramatic weight swings on a playground.",
                f"Let's be honest here... {gain:.1f} pounds means you've been dishonest with yourself, darling.",
                f"Grow up! {gain:.1f} pounds doesn't happen by accident, sweetie."
            ]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            responses = [
                f"Girl, {gain:.1f} pounds? We need to talk about your relationship with snacks.",
                f"Honey, no. {gain:.1f} pounds is not the direction we're going in.",
                f"Bless your heart, but {gain:.1f} pounds means the fridge won this round.",
                f"I'm just saying... {gain:.1f} pounds doesn't magically appear overnight, bestie."
            ]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            responses = [
                f"DROP AND GIVE ME TWENTY! {gain:.1f} pounds means you've been AWOL from discipline!",
                f"NO EXCUSES! {gain:.1f} pounds is {gain:.1f} pounds too many! MOVE IT!",
                f"SOLDIER! {gain:.1f} pounds means you've been fraternizing with the enemy - also known as junk food!",
                f"HOORAH for honesty, but {gain:.1f} pounds means you need to get back in formation!"
            ]
        else:  # Passive-Aggressive Mom
            responses = [
                f"Well, {gain:.1f} pounds... I suppose that's what happens when we make 'choices.'",
                f"I'm not mad about the {gain:.1f} pounds, just... disappointed in your commitment.",
                f"That's interesting... {gain:.1f} pounds. I guess my advice about portion control fell on deaf ears.",
                f"Whatever makes you happy, dear. Even if it's {gain:.1f} extra pounds."
            ]
        
        # Add trigger-specific responses
        if triggers:
            trigger = random.choice(triggers)
            if self.voice_preset == VoicePreset.SASSY_BFF:
                responses.append(f"Remember that {trigger}? It's crying somewhere because of these {gain:.1f} pounds.")
        
        return responses
    
    def _get_weight_loss_responses(self, loss: float, triggers: List[str], progress: Dict) -> List[str]:
        voice_style = self._get_voice_style()
        
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            responses = [
                f"Finally! {loss:.1f} pounds down! Now that's what I call proper execution!",
                f"Brilliant! {loss:.1f} pounds lost! You're cooking with gas now!",
                f"Beautiful! {loss:.1f} pounds gone! This is how it's done, you beautiful human!",
                f"Outstanding! {loss:.1f} pounds down! You're becoming a lean, mean, fighting machine!"
            ]
        elif self.voice_preset == VoicePreset.JOAN_RIVERS:
            responses = [
                f"Fabulous! {loss:.1f} pounds down! You're becoming positively glamorous!",
                f"Gorgeous! {loss:.1f} pounds lost! Now THAT'S red carpet material!",
                f"Stunning! {loss:.1f} pounds gone! Someone's ready for their close-up!",
                f"Magnificent! {loss:.1f} pounds down! You're glowing, darling!"
            ]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            responses = [
                f"YES QUEEN! {loss:.1f} pounds down! You're absolutely slaying this!",
                f"Look at you! {loss:.1f} pounds lost! I'm so proud I could cry!",
                f"YASSS! {loss:.1f} pounds gone! You're that girl, and don't you forget it!",
                f"Bestie! {loss:.1f} pounds down! You're out here making it look easy!"
            ]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            responses = [
                f"OUTSTANDING! {loss:.1f} pounds down! That's what discipline looks like!",
                f"EXCELLENT WORK! {loss:.1f} pounds lost! You're a machine!",
                f"HOORAH! {loss:.1f} pounds gone! That's military precision right there!",
                f"STELLAR PERFORMANCE! {loss:.1f} pounds down! Keep marching forward!"
            ]
        else:  # Passive-Aggressive Mom
            responses = [
                f"Well look at that, {loss:.1f} pounds down. I suppose you CAN follow through sometimes.",
                f"Oh my, {loss:.1f} pounds lost! Maybe you were listening to my advice after all.",
                f"How nice, {loss:.1f} pounds gone. It's amazing what happens when you actually try.",
                f"Well, well, {loss:.1f} pounds down. I guess miracles do happen."
            ]
        
        # Add progress-specific responses
        if progress["progress_percentage"] > 50:
            if self.voice_preset == VoicePreset.SASSY_BFF:
                responses.append(f"{loss:.1f} pounds closer to goal! You're over halfway there, superstar!")
        
        return responses
    
    def _get_weight_stable_responses(self) -> List[str]:
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return ["Same weight? At least you're not going backwards, you muppet!"]
        elif self.voice_preset == VoicePreset.JOAN_RIVERS:
            return ["Same weight? Consistency is a virtue, I suppose."]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return ["Same weight? Plateau vibes, but we're not giving up!"]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            return ["SAME WEIGHT! HOLDING THE LINE! NOW ADVANCE!"]
        else:
            return ["Same weight... well, at least you're not gaining, dear."]
    
    def _get_first_weigh_in_responses(self) -> List[str]:
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return ["Right! First weigh-in! Now we know where we're starting from, let's get to work!"]
        elif self.voice_preset == VoicePreset.JOAN_RIVERS:
            return ["First weigh-in, darling! The truth is out, now let's make some magic happen!"]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return ["First weigh-in! No judgment here, just excited to watch you glow up!"]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            return ["FIRST WEIGH-IN! BASELINE ESTABLISHED! NOW WE MARCH TOWARD VICTORY!"]
        else:
            return ["First weigh-in... well, at least you're being honest with yourself."]

    # Feature 2: Push Notification Reminders
    def get_reminder_message(self, reminder_type: str) -> str:
        if self.kindness_mode:
            return self._get_kindness_response("reminder")
        
        reminders = {
            "morning_motivation": self._get_morning_reminders(),
            "lunch_check": self._get_lunch_reminders(),
            "afternoon_boost": self._get_afternoon_reminders(),
            "evening_accountability": self._get_evening_reminders(),
            "workout_time": self._get_workout_reminders(),
            "snack_attack": self._get_snack_reminders()
        }
        
        reminder_list = reminders.get(reminder_type, ["Time to check in with yourself!"])
        filtered_reminders = self._apply_intensity_filter(reminder_list)
        return random.choice(filtered_reminders)
    
    def _get_morning_reminders(self) -> List[str]:
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return [
                "Wake up! Today's the day you stop making excuses and start making progress!",
                "Right! New day, new chance to not mess up your goals!",
                "Get up! Your future self is counting on what you do today!"
            ]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return [
                "Good morning, gorgeous! Today we're choosing violence... against bad habits!",
                "Rise and grind, bestie! Your goals aren't going to achieve themselves!",
                "Morning, superstar! Time to be the main character in your own story!"
            ]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            return [
                "REVEILLE! Time to attack this day with military precision!",
                "UP AND AT 'EM! Today's mission: crush your fitness goals!",
                "MORNING FORMATION! Ready to march toward victory?"
            ]
        return ["Good morning! Time to make some healthy choices!"]
    
    def _get_snack_reminders(self) -> List[str]:
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return [
                "Step away from the fridge! This is not the ending you want for your hero's journey!",
                "Put that snack down! You're better than a mindless munch session!",
                "What are you doing? That's not on the menu for success!"
            ]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return [
                "Bestie, step away from the snacks! We talked about this!",
                "Girl, that's not hunger talking - that's boredom with a PhD in manipulation!",
                "Honey, ask yourself: am I actually hungry or just avoiding feelings?"
            ]
        return ["Maybe try some water first?"]

    # Feature 3: Shame Mode Panic Button
    def get_shame_mode_response(self, trigger_context: str = "general") -> str:
        if self.kindness_mode:
            return self._get_kindness_response("shame_button")
        
        self.user_data.press_shame_button()
        responses = self._get_shame_responses(trigger_context)
        filtered_responses = self._apply_intensity_filter(responses)
        return random.choice(filtered_responses)
    
    def _get_shame_responses(self, context: str) -> List[str]:
        triggers = self.user_data.get_personal_triggers()
        
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            responses = [
                "STOP RIGHT THERE! What would Gordon say about this decision?",
                "You muppet! Is this really how you want to sabotage your progress?",
                "This is a disaster waiting to happen! Step back and think!",
                "Raw! Your willpower is RAW! Cook up some self-control!"
            ]
        elif self.voice_preset == VoicePreset.JOAN_RIVERS:
            responses = [
                "Can we talk? Because this decision is about to be a comedy... and not the good kind!",
                "Oh please! You're better than this moment of weakness, darling!",
                "Seriously? After all that hard work, you're going to let this temptation win?",
                "Let's be honest - future you is going to HATE present you for this choice!"
            ]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            responses = [
                "GIRL. STOP. We need to have a serious conversation right now!",
                "Bestie, I love you too much to watch you self-sabotage like this!",
                "Honey, no. This is not the main character energy we're going for!",
                "Sis, remember why you started this journey! Don't throw it away for a moment!"
            ]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            responses = [
                "HALT! SOLDIER! This is not the mission we signed up for!",
                "STAND DOWN! You're about to compromise the entire operation!",
                "NEGATIVE! Retreat from that temptation and regroup!",
                "ABANDON MISSION! This is not the hill you want to die on!"
            ]
        else:
            responses = [
                "Oh dear... is this really what we're doing now?",
                "I suppose this is your choice... but I'm disappointed.",
                "Well, if this is how you want to handle your commitment...",
                "Whatever makes you feel better, I guess..."
            ]
        
        # Add trigger-specific responses
        if triggers and context == "general":
            trigger = random.choice(triggers)
            if self.voice_preset == VoicePreset.SASSY_BFF:
                responses.append(f"Think about {trigger}! Is this moment worth giving up on that dream?")
        
        return responses

    # Feature 4: Personal Trigger Integration
    def get_trigger_specific_response(self, trigger: str, context: str = "motivation") -> str:
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return f"Remember {trigger}? Don't let a moment of weakness ruin that dream!"
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return f"Bestie, think about {trigger}! You've got this!"
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            return f"SOLDIER! {trigger} is your mission objective! Stay focused!"
        else:
            return f"Don't forget about {trigger}, dear."

    # Feature 5: Roast Buddy Mode
    def get_roast_buddy_response(self) -> Optional[str]:
        buddy_message = self.user_data.get_unused_roast_buddy_message()
        if not buddy_message:
            return None
        
        # Wrap the buddy message in the selected voice style
        voice_style = self._get_voice_style()
        
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return f"Your mate {buddy_message.sender_name} says: '{buddy_message.message}' - And I couldn't agree more, you muppet!"
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return f"Your bestie {buddy_message.sender_name} wants you to know: '{buddy_message.message}' - And honestly? They're not wrong!"
        else:
            return f"Message from {buddy_message.sender_name}: '{buddy_message.message}'"

    # Feature 6: Motivational Unlockables
    def get_unlock_celebration(self, level: int) -> str:
        workout_stats = self.user_data.get_workout_stats()
        
        celebrations = {
            2: "LEVEL UP! You've unlocked intermediate sass! Your dedication is showing!",
            3: "CONGRATULATIONS! Advanced mockery mode activated! You're crushing this!",
            4: "INCREDIBLE! Expert-level roasts unlocked! You're a fitness warrior!",
            5: "LEGENDARY! Maximum tough love achieved! You're absolutely unstoppable!"
        }
        
        base_message = celebrations.get(level, "Achievement unlocked!")
        
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return f"BRILLIANT! {base_message} That's what I call commitment!"
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return f"YASSS! {base_message} I'm so proud I could cry!"
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            return f"OUTSTANDING! {base_message} That's military-grade dedication!"
        else:
            return base_message

    # Feature 7: Voice-Specific Workout Motivation
    def get_workout_motivation(self, workout_type: str = "general") -> str:
        if self.kindness_mode:
            return self._get_kindness_response("workout_motivation")
        
        motivations = self._get_workout_motivations(workout_type)
        filtered_motivations = self._apply_intensity_filter(motivations)
        return random.choice(filtered_motivations)
    
    def _get_workout_motivations(self, workout_type: str) -> List[str]:
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return [
                f"Right! Time for {workout_type}! Cook up some sweat and serve yourself some results!",
                f"Move it! That {workout_type} isn't going to do itself!",
                f"Get in there! {workout_type.title()} time! Show me what you're made of!"
            ]
        elif self.voice_preset == VoicePreset.JOAN_RIVERS:
            return [
                f"Time for {workout_type}, darling! Glamour requires effort!",
                f"Let's go! {workout_type.title()} is calling, and we don't keep success waiting!",
                f"Move it, gorgeous! That {workout_type} is your ticket to fabulousness!"
            ]
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return [
                f"Come on, queen! {workout_type.title()} time! Let's get that glow!",
                f"Bestie! Time for {workout_type}! You're about to feel SO good!",
                f"Let's GO! {workout_type.title()} is calling your name!"
            ]
        elif self.voice_preset == VoicePreset.DRILL_SERGEANT:
            return [
                f"TIME FOR {workout_type.upper()}! MOVE THOSE MUSCLES, SOLDIER!",
                f"LET'S GO! {workout_type.upper()} IS YOUR MISSION! EXECUTE!",
                f"NO EXCUSES! {workout_type.upper()} TIME! SHOW ME WHAT YOU'VE GOT!"
            ]
        else:
            return [
                f"Time for {workout_type}, dear. I suppose you should get moving.",
                f"Well, {workout_type} is on the schedule... if you're up for it.",
                f"I guess it's {workout_type} time. Don't let me down."
            ]

    def get_progress_summary(self) -> str:
        stats = self.user_data.get_user_stats()
        progress = stats["weight_progress"]
        
        if self.voice_preset == VoicePreset.GORDON_RAMSAY:
            return f"Right! Here's where you stand: {stats['total_workouts']} workouts, {stats['streak']} day streak, {progress['total_loss']:.1f} pounds lost! Keep pushing!"
        elif self.voice_preset == VoicePreset.SASSY_BFF:
            return f"Progress report, bestie! {stats['total_workouts']} workouts done, {stats['streak']} day streak going strong, and {progress['total_loss']:.1f} pounds closer to your goal! You're killing it!"
        else:
            return f"Current progress: {stats['total_workouts']} workouts completed, {stats['streak']} day streak, {progress['total_loss']:.1f} pounds lost."