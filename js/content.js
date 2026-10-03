/* =========================================================
   EVERYTHING YOU MIGHT WANT TO EDIT LIVES IN THIS FILE.
   Photos, captions, memories, quiz, letter, prayer.
   Anything wrapped in [BRACKETS] is a placeholder waiting for you.
   ========================================================= */

window.SITE = {

  /* ---------- ASSET PATHS ---------- */
  video: "assets/video/for-nana.mp4",          // drop your video here (mp4, h264)
  videoPoster: "assets/video/poster.jpg",
  videoAspect: "464 / 832",                     // your video is portrait; change if you swap it
  music: [
    { title: "Wildest Dreams",              src: "assets/music/wildest-dreams.mp3" },
    { title: "Can't Help Falling in Love",  src: "assets/music/cant-help-falling-in-love.mp3" }
  ],

  /* ---------- SCREEN 1: THE SECRET ENTRANCE ---------- */
  gate: {
    question: "What happened on 14 December?",
    // Any of these words counts as correct (lowercase). Add more if you like.
    answers: ["sex"],
    extraAnswers: []
  },

  /* ---------- SCREEN 2: BOUQUET (tap a flower, a gift tag swings in) ---------- */
  flowerNotes: [
    "I wish I could've been there for this one.",
    "I'm so proud of you.",
    "I miss you terribly.",
    "We never used to miss each other's birthdays.",
    "Distance is temporary.",
    "There's someone in India rooting for you.",
    "You're my person."
  ],

  /* ---------- SCREEN 3: MEMORY CLOUD ----------
     file  -> file inside assets/photos/
     ar    -> width / height of the picture (already measured)
     w     -> how big it floats on a phone (px). Bigger = nearer
     d     -> depth. 0.7 far & slow, 1.3 close & a bit faster
     frame -> 'border' | 'polaroid' | 'none' | 'phone'
     tape  -> little piece of tape on top
     cap   -> handwritten caption (null = no caption)
  */
  photos: [
    { id:"01", file:"01-facetime.jpg",          ar:0.461,  w:92,  d:0.8,  frame:"phone",    tape:false, cap:"Our little FaceTime window." },
    { id:"02", file:"02-dinner-laughing.jpg",   ar:1.3333, w:150, d:1.1,  frame:"border",   tape:true,  cap:"Another completely normal day that somehow became a memory." },
    { id:"03", file:"03-dinner-close.jpg",      ar:1.3333, w:140, d:0.9,  frame:"polaroid", tape:false, cap:null },
    { id:"04", file:"04-scooter.jpg",           ar:1.3333, w:150, d:1.2,  frame:"border",   tape:true,  cap:"Scooter rides." },
    { id:"05", file:"05-sofa-hug.jpg",          ar:1.3333, w:140, d:1.0,  frame:"polaroid", tape:false, cap:"Being in your arms." },
    { id:"06", file:"06-ikea-idiots.jpg",       ar:1.3333, w:146, d:1.15, frame:"border",   tape:false, cap:"Us being idiots." },
    { id:"07", file:"07-bw-cuddle.jpg",         ar:0.722,  w:110, d:0.75, frame:"border",   tape:false, cap:null },
    { id:"08", file:"08-straw.jpg",             ar:1.3333, w:136, d:0.85, frame:"border",   tape:true,  cap:"Us being idiots, part two." },
    { id:"09", file:"09-polaroid.jpg",          ar:0.736,  w:120, d:1.25, frame:"none",     tape:false, cap:null },
    { id:"10", file:"10-windy-lake.jpg",        ar:0.566,  w:96,  d:0.8,  frame:"border",   tape:false, cap:"Windy." },
    { id:"11", file:"11-theatre-dark.jpg",      ar:1.7762, w:160, d:0.7,  frame:"border",   tape:false, cap:null },
    { id:"12", file:"12-baby-yellow.jpg",       ar:0.75,   w:112, d:1.1,  frame:"polaroid", tape:true,  cap:"Nana, but tiny." },
    { id:"13", file:"13-baby-laughing.jpg",     ar:0.75,   w:108, d:0.95, frame:"polaroid", tape:false, cap:"Tiny Nana, laughing." },
    { id:"14", file:"14-pool-hug.jpg",          ar:0.563,  w:96,  d:0.9,  frame:"border",   tape:false, cap:null },
    { id:"15", file:"15-pool-kiss.jpg",         ar:1.1136, w:128, d:1.0,  frame:"border",   tape:false, cap:null },
    { id:"16", file:"16-cinema-snacks.jpg",     ar:1.3333, w:150, d:1.2,  frame:"border",   tape:true,  cap:"Movies, with snacks." },
    { id:"17", file:"17-matching-jackets.jpg",  ar:0.563,  w:96,  d:0.8,  frame:"border",   tape:false, cap:"Matching jackets." },
    { id:"18", file:"18-arena.jpg",             ar:0.75,   w:112, d:1.05, frame:"polaroid", tape:false, cap:"Twinning in navy." },
    { id:"19", file:"19-parking-selfie.jpg",    ar:0.75,   w:108, d:0.85, frame:"border",   tape:true,  cap:null },
    { id:"20", file:"20-arch-silhouette.jpg",   ar:0.562,  w:98,  d:1.0,  frame:"border",   tape:false, cap:null },
    { id:"21", file:"21-ferry-chin.jpg",        ar:1.3333, w:150, d:1.1,  frame:"border",   tape:true,  cap:"Me holding your chin." },
    { id:"22", file:"22-brick-cheek-kiss.jpg",  ar:0.566,  w:98,  d:0.9,  frame:"polaroid", tape:false, cap:"A kiss on the cheek." },
    { id:"23", file:"23-cuddle-closeup.jpg",    ar:0.74,   w:112, d:1.0,  frame:"border",   tape:false, cap:null },
    { id:"24", file:"24-blue-seat-smiles.jpg",  ar:1.3333, w:140, d:0.85, frame:"border",   tape:true,  cap:null },
    { id:"25", file:"25-pink-hat.jpg",          ar:1.7483, w:160, d:0.8,  frame:"border",   tape:false, cap:null },
    { id:"26", file:"26-fairy-lights-hug.jpg",  ar:0.572,  w:100, d:1.05, frame:"polaroid", tape:false, cap:"Fairy lights and a hug." }
  ],

  // little torn-paper scraps that drift between the photos
  scraps: [
    "June 15, 2024.",
    "The day we became us.",
    "The canteen where we laughed way too much.",
    "The rooftop.",
    "The ice cream conversations."
  ],

  /* ---------- SCREEN 4: YOU KNOW WHAT'S STUPID? ----------
     x / y are positions on the "desk", in percent. */
  stupid: [
    { icon:"rooftop",   x:12, y:8,  r:-6, size:96, title:"The rooftop",
      text:"We randomly went to a rooftop because I hadn't lit a firecracker in years. You got one for me. We were also kissing there." },
    { icon:"play",      x:60, y:4,  r:5,  size:80, title:"The YouTube videos",
      text:"We used to watch random YouTube videos together in college and laugh like idiots." },
    { icon:"bench",     x:38, y:26, r:-3, size:84, title:"The bunk",
      text:"We once bunked and sat somewhere outside the canteen having deep conversations." },
    { icon:"dancer",    x:74, y:30, r:7,  size:82, title:"The dancing",
      text:"You tried to lift me while we were dancing (or trying to dance) and I would start laughing." },
    { icon:"bucket",    x:8,  y:44, r:4,  size:84, title:"The bucket",
      text:"My leg got stuck in a bucket while we were trying to kiss. Ridiculous." },
    { icon:"laugh",     x:44, y:50, r:-8, size:80, title:"The canteen",
      text:"We used to laugh extremely hard in the college canteen." },
    { icon:"icecream",  x:70, y:64, r:-4, size:86, title:"Cream Stone",
      text:"Late-night conversations outside Cream Stone while eating ice cream." },
    { icon:"coffee",    x:16, y:72, r:6,  size:80, title:"The coffee shops",
      text:"Random coffee-shop conversations during the day." }
  ],

  /* ---------- SCREEN 5: 23 LITTLE THINGS ----------
     type  -> look of the thing on the table: sticker | tag | stamp | note
     paper -> look of the paper when opened: note | index | polaroid | torn
     photo -> optional picture that appears on the paper (file in assets/photos) */
  things: [
    { icon:"basketball", type:"sticker", paper:"note",     title:"You playing basketball.",
      lines:["I am sorry but you look ridiculously hot playing basketball."] },
    { icon:"teddy",      type:"tag",     paper:"torn",     title:"The stupid soft toy.",
      lines:["You couldn't win it the first time.","Then you secretly went back and got it for me.","That meant more to me than you probably realized."] },
    { icon:"headphones", type:"stamp",   paper:"index",    title:"Wildest Dreams.",
      lines:["That song was playing in my headphones when I was waiting around hoping you'd show up."] },
    { icon:"plate",      type:"sticker", paper:"polaroid", title:"Eating with you.", photo:"16-cinema-snacks.jpg",
      lines:["I don't know why, but eating together with you is one of my favourite things."] },
    { icon:"smirk",      type:"tag",     paper:"note",     title:"You irritating me and then smiling.",
      lines:["I hate you.","…okay, maybe I don't."] },
    { icon:"scooter",    type:"stamp",   paper:"polaroid", title:"Our scooter rides.", photo:"04-scooter.jpg",
      lines:["I miss them."] },
    { icon:"coin",       type:"sticker", paper:"index",    title:"You.",
      lines:["Even when you barely had anything, you would spend it on me.","You always somehow made my choices matter."] },
    { icon:"dancer",     type:"tag",     paper:"torn",     title:"Me randomly dancing in public.",
      lines:["And you never acted embarrassed that you were with me."] },
    { icon:"hands",      type:"sticker", paper:"note",     title:"Holding you.",
      lines:["I miss it."] },
    { icon:"bust",       type:"stamp",   paper:"index",    title:"Being myself.",
      lines:["You are one of the few people I can completely be myself around."] },
    { icon:"cap",        type:"sticker", paper:"torn",     title:"You were my senior.",
      lines:["We met in college.","I had no idea."] },
    { icon:"bubble",     type:"tag",     paper:"note",     title:"Being positive.",
      lines:["You always tell me to be positive when I'm being horrible to myself.","You never make me feel stupid for being myself."] },
    { icon:"scent",      type:"sticker", paper:"index",    title:"Your smell.",
      lines:["I miss it."] },
    { icon:"cross",      type:"stamp",   paper:"torn",     title:"You pray for me.",
      lines:["That is one of the sweetest things anyone has ever done for me."] },
    { icon:"haha",       type:"sticker", paper:"note",     title:"Laughing with you.",
      lines:["Our stupid laughter.","I miss it."] },
    { icon:"house",      type:"tag",     paper:"index",    title:"My hometown.",
      lines:["It is full of memories of you."] },
    { icon:"arms",       type:"sticker", paper:"polaroid", title:"Being in your arms.", photo:"05-sofa-hug.jpg",
      lines:["I miss it."] },
    { icon:"calendar",   type:"stamp",   paper:"torn",     title:"Your birthday. My birthday.",
      lines:["We never used to miss each other's birthdays."] },
    { icon:"cake",       type:"sticker", paper:"note",     title:"This one.",
      lines:["This is the first time I can't physically be there.","I wish I could have done more."] },
    { icon:"plane",      type:"tag",     paper:"index",    title:"The airport.",
      lines:["I keep imagining it.","Me, meeting you there, and hugging you."] },
    { icon:"road",       type:"sticker", paper:"torn",     title:"What comes next.",
      lines:["I want a future filled with experiences together."] },
    { icon:"heart",      type:"stamp",   paper:"note",     title:"Life without you.",
      lines:["I can't imagine mine."] },
    { icon:"twoppl",     type:"sticker", paper:"index",    title:"My person.",
      lines:["I think that's what you became.","(You call me that too.)"] }
  ],

  /* ---------- SCREEN 6: THE GAME ---------- */
  game: {
    title: "One game, Nana.",
    intro: "Catch 10 kisses. Win, and there's a prize.",
    startMsg: "Swipe or tap an arrow to start",
    goal: 10,
    loseMsgs: ["Oops. You bit yourself. 😌", "Nana. Careful. 😭", "So close. Again?"],
    coupon: ["Winner: my super handsome man", "Valid: forever", "Redeem: whenever you want"],
    stamp: "no expiry"
  },

  /* ---------- SCREEN 6b: HIS CHATS ----------
     Screenshots live in assets/chats/. Captions are things he actually said. */
  chats: [
    { file: "chat-1.jpg", ar: 0.4913, cap: "“You're my princess nana.”" },
    { file: "chat-2.jpg", ar: 0.4913, cap: "“Cause now you are my life ra.”" },
    { file: "chat-3.jpg", ar: 0.4913, cap: "“I'll be however you want.”" },
    { file: "chat-4.jpg", ar: 0.4913, cap: "“Whatever makes you happy.”" }
  ],

  /* ---------- SCREEN 7: THINGS I DON'T WANT YOU TO FORGET ---------- */
  envelopes: [
    "Don't forget that I'm proud of you.",
    "Don't forget how much you are capable of.",
    "Don't forget our stupid laughter.",
    "Don't forget that you can always be yourself with me.",
    "Don't forget June 15, 2024.",
    "Don't forget that there is someone in India rooting for you.",
    "Don't forget that I still want all those future memories with you.",
    "Don't forget that distance is temporary."
  ],

  /* ---------- SCREEN 10: THE LETTER ----------
     One string per paragraph. Paste your real letter here, or send it to me. */
  letter: [
    "my person,",
    "I miss you. Like, really miss you.",
    "I miss eating with you, laughing with you, our stupid scooty rides, holding you, being in your arms, and all the tiny ordinary things I never realised I'd miss this much.",
    "My hometown is basically full of you now. Every random place has some version of us attached to it.",
    "I hate that I can't be there for your birthday this time. We never used to miss each other's birthdays, and I wish I could have done something more. So I made this instead.",
    "I'm trying. I'm trying to get where you are. I keep imagining that airport hug, imagining seeing you again, imagining all the places we'll go and all the stupid things we'll laugh about.",
    "I'm so proud of you. Of the person you are, the things you're building, and the way you keep showing up for me.",
    "Thank you for telling me to be positive when I'm horrible to myself. For being happy when I achieve something. For praying for me. For letting me be completely myself — weird, loud, annoying, dramatic, randomly singing, dancing in public, all of it.",
    "I don't know exactly what the future looks like. I just know I want to be there for it with you.",
    "So happy birthday to my super handsome man, my person, my favourite idiot.",
    "I'll see you soon. And when I do, I'm not letting go.",
    "I love you. ♡"
  ],
  letterSign: "your pretty girl",

  /* ---------- SCREEN 11: PRAYER ---------- */
  verse: "…but I found him whom my soul loveth: I held him, and would not let him go…",
  verseRef: "Song of Solomon 3:4",
  prayer: [
    "Lord, please keep Tony safe in Ireland.",
    "Protect me, and protect us, and what we have.",
    "Guide us through this distance. Keep us close even when we're far.",
    "Bring us back together.",
    "Help us build the future we keep imagining."
  ]
};
