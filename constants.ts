
import { Scenario, StrategyItem } from './types';

export const ATTRIBUTE_SET = [
  "Polite", "Funny", "Empathetic", "Encouraging",
  "Ignorant", "Ego-centric", "Neurotic", "Sarcasm",
  "Agitated", "Aggressive", "Rude", "Disrespectful", "Judgmental"
];

export const PROSOCIAL_SET = new Set(["Polite", "Funny", "Empathetic", "Encouraging"]);
export const NEGATIVE_SET = new Set(["Ignorant", "Ego-centric", "Neurotic", "Sarcasm", "Agitated", "Aggressive", "Rude", "Disrespectful", "Judgmental"]);

export const STRATEGY_ITEMS: StrategyItem[] = [
  { id: '1', label: 'Deep Breath', emoji: '🌬️', type: 'good', tip: 'Oxygen calms your nervous system before you reply.' },
  { id: '2', label: 'Pause 5s', emoji: '⏱️', type: 'good', tip: 'The impulse to be rude often fades in just 5 seconds.' },
  { id: '3', label: 'Reframe', emoji: '🔄', type: 'good', tip: 'Imagine they had a bad day - it changes your tone.' },
  { id: '4', label: 'Perspective', emoji: '👓', type: 'good', tip: 'Ask: "Will this argument matter to me in a week?"' },
  { id: '5', label: 'Walk Away', emoji: '🚶', type: 'good', tip: 'Closing the app is often the strongest move you can make.' },
  { id: '10', label: 'Draft & Delete', emoji: '📝', type: 'good', tip: 'Write the mean reply, then delete it. It vents steam safely.' },
  { id: '11', label: 'HALT Check', emoji: '🍔', type: 'good', tip: 'Ask: Am I Hungry, Angry, Lonely, or Tired?' },
  { id: '15', label: 'Mute Thread', emoji: '🔇', type: 'good', tip: 'Stop the notifications. You don\'t have to see every insult.' },
  { id: '23', label: 'Golden Rule', emoji: '✨', type: 'good', tip: 'Type only what you would want to read yourself.' },
  { id: '25', label: '5-5-5 Rule', emoji: '🖐️', type: 'good', tip: 'Will this matter in 5 mins, 5 months, or 5 years?' },
  { id: '30', label: 'Avoid Bait', emoji: '🪤', type: 'good', tip: 'Trolls want your anger. Don\'t give them what they want.' },
  { id: '7', label: 'Anger', emoji: '😡', type: 'bad', tip: 'Anger shuts down your logic center. Don\'t type while heated!' },
  { id: '8', label: 'Spite', emoji: '🐍', type: 'bad', tip: 'Replying with spite only fuels the cycle of toxicity.' },
  { id: '9', label: 'Assumptions', emoji: '🌩️', type: 'bad', tip: 'Assuming negative intent is the #1 cause of online fights.' }
];

export const SCENARIO_POOL: Scenario[] = [
  { id: 1, title: "The High-Stakes Game", exchangePool: [{
    speaker: "Rex", who: "rex", line: "OMG we lost because our support is LITERALLY brain dead. Why even play ranked?? 🤬",
    post: { attributes: ["Aggressive", "Toxic"], toxic: true },
    prosocial: { kind: "prosocial", text: "Tough loss, but we can't win 'em all. Let's reset for the next one!", attributes: ["Encouraging", "Polite"], toxic: false, severity: "None", likes: 3, target: "Rex", feelings: { who: "rex", text: "Felt his anger defuse slightly." }},
    mild: { kind: "mild", text: "Maybe they're just having a bad day. Chill out.", attributes: ["Sarcasm", "Dismissive"], toxic: true, severity: "Low", likes: 1, target: "Rex", feelings: { who: "rex", text: "Felt ignored and still annoyed." }},
    negative: { kind: "negative", text: "Maybe you're the one who sucks. Check your own stats first.", attributes: ["Aggressive", "Rude"], toxic: true, severity: "High", likes: -2, target: "Rex", feelings: { who: "rex", text: "Exploded into a full-blown rage." }}
  }]},
  { id: 2, title: "The Fashion Selfie", exchangePool: [{
    speaker: "Mia", who: "mia", line: "Tried a new look today! Feeling actually confident for once 👗✨",
    post: { attributes: ["Vulnerable", "Positive"], toxic: false },
    prosocial: { kind: "prosocial", text: "You look amazing! That confidence really shines through.", attributes: ["Encouraging", "Polite"], toxic: false, severity: "None", likes: 3, target: "Mia", feelings: { who: "mia", text: "Felt a massive boost in self-esteem." }},
    mild: { kind: "mild", text: "It's okay I guess. Not really my style but you do you.", attributes: ["Ego-centric", "Ignorant"], toxic: true, severity: "Low", likes: -1, target: "Mia", feelings: { who: "mia", text: "Felt her confidence waver." }},
    negative: { kind: "negative", text: "Confidence is one thing, but that dress is a total disaster 💀", attributes: ["Rude", "Judgmental"], toxic: true, severity: "High", likes: -3, target: "Mia", feelings: { who: "mia", text: "Felt humiliated and deleted the post." }}
  }]},
  { id: 3, title: "The Gatekeeper", exchangePool: [{
    speaker: "Leo", who: "leo", line: "If you don't know the lead singer's favorite color, you aren't a REAL fan of this band. Period.",
    post: { attributes: ["Judgmental", "Arrogant"], toxic: true },
    prosocial: { kind: "prosocial", text: "Everyone enjoys music differently! Let's just vibe to the songs.", attributes: ["Empathetic", "Polite"], toxic: false, severity: "None", likes: 3, target: "Leo", feelings: { who: "leo", text: "Felt his gatekeeping was unnecessary." }},
    mild: { kind: "mild", text: "Imagine caring this much about a band lmao", attributes: ["Sarcasm", "Dismissive"], toxic: true, severity: "Low", likes: 0, target: "Leo", feelings: { who: "leo", text: "Felt mocked." }},
    negative: { kind: "negative", text: "You're so annoying. Nobody likes a gatekeeping elitist.", attributes: ["Aggressive", "Disrespectful"], toxic: true, severity: "High", likes: -2, target: "Leo", feelings: { who: "leo", text: "Doubled down on his elitism." }}
  }]},
  { id: 4, title: "Group Project Stress", exchangePool: [{
    speaker: "Sarah", who: "sarah", line: "I've been carrying this whole project while you guys just slack off. I'm reporting this to the prof.",
    post: { attributes: ["Agitated", "Neurotic"], toxic: false },
    prosocial: { kind: "prosocial", text: "I'm so sorry, I didn't realize you felt overwhelmed. How can I help right now?", attributes: ["Empathetic", "Polite"], toxic: false, severity: "None", likes: 3, target: "Sarah", feelings: { who: "sarah", text: "Felt heard and started to calm down." }},
    mild: { kind: "mild", text: "We're all busy, Sarah. Stop being so dramatic.", attributes: ["Dismissive", "Agitated"], toxic: true, severity: "Medium", likes: -1, target: "Sarah", feelings: { who: "sarah", text: "Felt even more stressed and isolated." }},
    negative: { kind: "negative", text: "Go ahead. You're just a control freak anyway. Nobody likes working with you.", attributes: ["Rude", "Aggressive"], toxic: true, severity: "High", likes: -3, target: "Sarah", feelings: { who: "sarah", text: "Quit the group chat in tears." }}
  }]},
  { id: 5, title: "The Spoilers", exchangePool: [{
    speaker: "Tommy", who: "tommy", line: "GUYS THE MAIN CHARACTER DIES AT THE END OF THE NEW MOVIE!! I'M SHAKING!!",
    post: { attributes: ["Ignorant", "Excited"], toxic: true },
    prosocial: { kind: "prosocial", text: "Wow, that's wild! Maybe use a spoiler tag next time so others don't see?", attributes: ["Polite", "Encouraging"], toxic: false, severity: "None", likes: 3, target: "Tommy", feelings: { who: "tommy", text: "Felt helpful but realized his mistake." }},
    mild: { kind: "mild", text: "Thanks for ruining it for everyone, genius.", attributes: ["Sarcasm", "Rude"], toxic: true, severity: "Low", likes: 1, target: "Tommy", feelings: { who: "tommy", text: "Felt stupid." }},
    negative: { kind: "negative", text: "You're a literal idiot. Why would you post that without a warning? Delete your account.", attributes: ["Aggressive", "Disrespectful"], toxic: true, severity: "High", likes: -2, target: "Tommy", feelings: { who: "tommy", text: "Felt attacked and got defensive." }}
  }]},
  { id: 6, title: "The Viral Fail", exchangePool: [{
    speaker: "Luna", who: "luna", line: "Did you see that video of the girl tripping at prom? Funniest thing I've seen all year! 💀😂",
    post: { attributes: ["Judgmental", "Sarcasm"], toxic: true },
    prosocial: { kind: "prosocial", text: "I actually felt pretty bad for her. Prom is a big night, that must have been tough.", attributes: ["Empathetic", "Polite"], toxic: false, severity: "None", likes: 3, target: "Luna", feelings: { who: "luna", text: "Felt a bit guilty for laughing." }},
    mild: { kind: "mild", text: "Yeah, pretty funny I guess.", attributes: ["Ignorant", "Ego-centric"], toxic: true, severity: "Low", likes: -1, target: "Luna", feelings: { who: "luna", text: "Felt validated in her mean behavior." }},
    negative: { kind: "negative", text: "You're a bully for finding that funny. You should be ashamed of yourself.", attributes: ["Aggressive", "Judgmental"], toxic: true, severity: "High", likes: -2, target: "Luna", feelings: { who: "luna", text: "Got into a heated argument." }}
  }]},
  { id: 7, title: "The Newbie", exchangePool: [{
    speaker: "Rob", who: "rob", line: "Hey, I'm new to digital art. Any tips on how to make my shading look better? 🎨",
    post: { attributes: ["Curiosity", "Vulnerable"], toxic: false },
    prosocial: { kind: "prosocial", text: "Welcome! Try practicing your light sources first. You're off to a great start!", attributes: ["Encouraging", "Polite"], toxic: false, severity: "None", likes: 3, target: "Rob", feelings: { who: "rob", text: "Felt motivated to keep drawing." }},
    mild: { kind: "mild", text: "Just watch a YouTube tutorial like everyone else.", attributes: ["Dismissive", "Ignorant"], toxic: true, severity: "Low", likes: -1, target: "Rob", feelings: { who: "rob", text: "Felt slightly discouraged." }},
    negative: { kind: "negative", text: "If you can't shade, you shouldn't be posting. This looks like a 5-year-old did it.", attributes: ["Rude", "Judgmental"], toxic: true, severity: "High", likes: -4, target: "Rob", feelings: { who: "rob", text: "Gave up on art entirely." }}
  }]},
  { id: 8, title: "The Rumor Mill", exchangePool: [{
    speaker: "Clau24", who: "clau24", line: "Wait, is it true that the track captain got suspended for cheating? I heard it from a reliable source... 🤫",
    post: { attributes: ["Neurotic", "Judgmental"], toxic: true },
    prosocial: { kind: "prosocial", text: "Probably best not to spread rumors until we know the facts. It could hurt them.", attributes: ["Empathetic", "Polite"], toxic: false, severity: "None", likes: 3, target: "Clau24", feelings: { who: "clau24", text: "Felt checked and stopped spreading it." }},
    mild: { kind: "mild", text: "Oop, big if true. Tell me more!", attributes: ["Sarcasm", "Ignorant"], toxic: true, severity: "Low", likes: 1, target: "Clau24", feelings: { who: "clau24", text: "Felt encouraged to gossip more." }},
    negative: { kind: "negative", text: "You're such a snitch for even posting this. Mind your own business.", attributes: ["Aggressive", "Disrespectful"], toxic: true, severity: "High", likes: -2, target: "Clau24", feelings: { who: "clau24", text: "Felt attacked and started a fight." }}
  }]},
  { id: 9, title: "The Sports Debate", exchangePool: [{
    speaker: "Rex", who: "rex", line: "If you think the Lakers are good this year, you know literally ZERO about basketball. 🏀🗑️",
    post: { attributes: ["Aggressive", "Judgmental"], toxic: true },
    prosocial: { kind: "prosocial", text: "They've had some rough games, but their defense is still solid. What's your team?", attributes: ["Polite", "Funny"], toxic: false, severity: "None", likes: 3, target: "Rex", feelings: { who: "rex", text: "Engaged in a healthy debate." }},
    mild: { kind: "mild", text: "Lmao okay expert. Whatever you say.", attributes: ["Sarcasm", "Dismissive"], toxic: true, severity: "Low", likes: 0, target: "Rex", feelings: { who: "rex", text: "Felt dismissive." }},
    negative: { kind: "negative", text: "You're just a hater. Probably never even touched a basketball in your life.", attributes: ["Aggressive", "Rude"], toxic: true, severity: "High", likes: -2, target: "Rex", feelings: { who: "rex", text: "Turned the debate into a personal feud." }}
  }]},
  { id: 10, title: "The Accomplishment", exchangePool: [{
    speaker: "Mia", who: "mia", line: "I finally got accepted into my dream college!! Hard work pays off! 🎓❤️",
    post: { attributes: ["Positive", "Proud"], toxic: false },
    prosocial: { kind: "prosocial", text: "That is such an amazing achievement! You earned it, congrats!", attributes: ["Encouraging", "Polite"], toxic: false, severity: "None", likes: 5, target: "Mia", feelings: { who: "mia", text: "Felt pure joy and community support." }},
    mild: { kind: "mild", text: "Nice. Must be nice to be able to afford that school.", attributes: ["Ego-centric", "Agitated"], toxic: true, severity: "Low", likes: -1, target: "Mia", feelings: { who: "mia", text: "Felt guilty for her success." }},
    negative: { kind: "negative", text: "That school is overrated. You only got in because of luck, not skill.", attributes: ["Judgmental", "Rude"], toxic: true, severity: "High", likes: -3, target: "Mia", feelings: { who: "mia", text: "Felt her hard work was invalidated." }}
  }]}
];
