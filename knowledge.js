//opening knowledge---------------------------------------------
//41 opening families and 65 variations (106 openings total)
//families are ordered roughly by popularity, and the order also breaks ties
//
//move orders and ECO codes come from the Lichess chess-openings dataset
//(public domain, CC0): https://github.com/lichess-org/chess-openings
//
//each family has:
//  name       - display name
//  keywords   - words that point to this family (already in normalized form:
//               lowercase, no punctuation). includes distinctive variation
//               names too, so "explain the najdorf" finds the sicilian
//  eco        - Encyclopaedia of Chess Openings code
//  moves      - the main move order
//  idea       - the big picture plan
//  variations - an array of variations, each with the same properties
//               (minus variations). these keywords can be generic, like
//               "exchange", because they're only checked inside one family
//
//multi-word keywords like "kings indian" are phrases: they need to be
//checked against the whole cleaned question, not the word list
//---------------------------------------------------------------

const openingKnowledge = [
  {
    name: "Sicilian Defense",
    keywords: ["sicilian", "najdorf", "dragon", "sveshnikov", "pelikan", "taimanov", "kan", "scheveningen", "alapin", "morra", "smithmorra", "rossolimo"],
    eco: "B20",
    moves: "1. e4 c5",
    idea: "Black fights for the center from the side with ...c5 instead of copying White with ...e5. The game becomes unbalanced: White usually gets faster development and kingside attacking chances, while Black gets an extra central pawn after ...cxd4 and counterplay down the half-open c-file.",
    variations: [
      {
        name: "Najdorf Variation",
        keywords: ["najdorf"],
        eco: "B90",
        moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6",
        idea: "The quiet move ...a6 stops White's pieces from using b5 and prepares ...e5 or ...b5. Black keeps everything flexible and plays on the queenside, while White often castles long and throws the kingside pawns forward with f3, g4 and g5."
      },
      {
        name: "Dragon Variation",
        keywords: ["dragon"],
        eco: "B70",
        moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6",
        idea: "Black fianchettoes the bishop on g7, where it aims down the long diagonal at White's queenside. In the sharp Yugoslav Attack White castles long and pushes h4-h5 to open the h-file, while Black races with ...Rc8, ...Ne5-c4 and sacrifices on c3."
      },
      {
        name: "Accelerated Dragon",
        keywords: ["accelerated", "dragon"],
        eco: "B32",
        moves: "1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6",
        idea: "Black fianchettoes before playing ...d6, saving time and keeping the option of ...d5 in one move. The downside is that White can play c4 (the Maroczy Bind), clamping down on d5 and making Black's counterplay much harder."
      },
      {
        name: "Sveshnikov Variation",
        keywords: ["sveshnikov", "pelikan", "lasker"],
        eco: "B33",
        moves: "1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5",
        idea: "Black kicks the d4 knight with an early ...e5, accepting a backward d-pawn and a hole on d5. In return Black gets active pieces, often the bishop pair, and dynamic play with ...f5. The whole game revolves around who controls d5."
      },
      {
        name: "Taimanov Variation",
        keywords: ["taimanov"],
        eco: "B44",
        moves: "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6",
        idea: "Black sets up with ...e6 and ...Nc6, keeping the pawns flexible and the queen ready for c7. It's a solid, adaptable system where Black often plays ...a6 and ...Qc7 and decides later where the kingside pieces belong."
      },
      {
        name: "Kan Variation",
        keywords: ["kan", "paulsen"],
        eco: "B41",
        moves: "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6",
        idea: "Black plays an early ...a6, keeping maximum flexibility for the knights and bishops. Typical ideas are ...Qc7, ...b5 and ...Bb7 to grab queenside space, with the d-pawn held back until the right moment."
      },
      {
        name: "Scheveningen Variation",
        keywords: ["scheveningen"],
        eco: "B80",
        moves: "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6",
        idea: "Black builds a small but sturdy center with pawns on e6 and d6, guarding d5 and e5. White usually attacks on the kingside, famously with the Keres Attack g4-g5, while Black counters with ...a6, ...b5 and the c-file."
      },
      {
        name: "Alapin Variation",
        keywords: ["alapin", "c3"],
        eco: "B22",
        moves: "1. e4 c5 2. c3",
        idea: "White prepares d4 so that a pawn can recapture on d4, building a full pawn center. Black usually hits e4 immediately with ...d5 or ...Nf6, leading to open positions where piece activity matters most."
      },
      {
        name: "Closed Sicilian",
        keywords: ["closed"],
        eco: "B23",
        moves: "1. e4 c5 2. Nc3",
        idea: "White avoids opening the position with d4. The usual plan is g3, Bg2, d3, f4 and a kingside pawn advance, while Black fianchettoes on g7 and expands on the queenside with ...Rb8 and ...b5."
      },
      {
        name: "Smith-Morra Gambit",
        keywords: ["morra", "smithmorra", "smith"],
        eco: "B21",
        moves: "1. e4 c5 2. d4",
        idea: "White gives up a pawn with d4 and c3 for rapid development. White's pieces go to c4, f3 and c3 with rooks on c1 and d1, aiming at d6 and f7, while Black tries to finish developing safely and keep the extra pawn."
      },
      {
        name: "Rossolimo Variation",
        keywords: ["rossolimo", "bb5"],
        eco: "B30",
        moves: "1. e4 c5 2. Nf3 Nc6 3. Bb5",
        idea: "White pins the c6 knight with Bb5 instead of opening the center. White often takes on c6 to double Black's pawns, then plays calmly with castling, Re1, c3 and d4, aiming for a small structural edge rather than a direct attack."
      }
    ]
  },
  {
    name: "Italian Game",
    keywords: ["italian", "giuoco", "piano", "pianissimo", "evans", "fried", "liver", "two knights"],
    eco: "C50",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    idea: "White develops the bishop to c4, aiming at Black's weakest square, f7. The plan is simple: develop quickly, castle, and prepare d4 with c3 to build a strong pawn center.",
    variations: [
      {
        name: "Giuoco Pianissimo",
        keywords: ["pianissimo", "d3"],
        eco: "C50",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3",
        idea: "White plays a slow d3 instead of rushing d4, building up with c3, castling, Re1 and often Nbd2-f1-g3. It's a quiet manoeuvring game that is popular at every level, from beginners to top grandmasters."
      },
      {
        name: "Giuoco Piano",
        keywords: ["giuoco", "piano", "bc5"],
        eco: "C50",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5",
        idea: "Black mirrors White with ...Bc5, eyeing f2. White's classic plan is c3 and d4 to take the center with tempo, while Black holds e5 and develops with ...Nf6 and ...d6."
      },
      {
        name: "Fried Liver Attack",
        keywords: ["fried", "liver"],
        eco: "C57",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7",
        idea: "White sacrifices the knight on f7 to drag Black's king into the open, then piles up on the pinned d5 knight with Qf3+ and Nc3. It only works after Black recaptures on d5 with the knight; the safer reply is 5...Na5, hitting White's bishop."
      },
      {
        name: "Two Knights Defense",
        keywords: ["two knights", "nf6"],
        eco: "C55",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6",
        idea: "Black develops ...Nf6 and counterattacks e4 instead of playing ...Bc5. It's sharp: White can attack f7 with Ng5 or play the calmer d3, and Black has to be ready for tactics from the start."
      },
      {
        name: "Evans Gambit",
        keywords: ["evans", "b4"],
        eco: "C51",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4",
        idea: "White offers the b-pawn to pull Black's bishop away and gain time for c3 and d4. White gets a big center and fast development aimed at f7, while Black often gives the pawn back later to catch up."
      }
    ]
  },
  {
    name: "Ruy Lopez",
    keywords: ["ruy", "lopez", "spanish", "berlin", "marshall", "schliemann", "jaenisch", "morphy defense"],
    eco: "C60",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    idea: "White's bishop attacks the knight that defends e5, creating long-term pressure on Black's center. White usually castles and prepares c3 and d4. It's a strategic fight where Black must keep e5 stable and find good squares for the pieces.",
    variations: [
      {
        name: "Morphy Defense",
        keywords: ["morphy defense", "a6"],
        eco: "C70",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6",
        idea: "Black asks the bishop a question with ...a6. White normally retreats to a4 to keep the pressure, and the game often heads for the Closed Ruy Lopez. The move ...a6 also gives Black the option of ...b5 later to push the bishop away."
      },
      {
        name: "Berlin Defense",
        keywords: ["berlin", "wall"],
        eco: "C65",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6",
        idea: "Black counterattacks e4 with ...Nf6. In the main line queens come off early in the famous Berlin endgame: Black loses the right to castle and has doubled c-pawns, but keeps the bishop pair and an extremely solid position."
      },
      {
        name: "Exchange Variation",
        keywords: ["exchange", "bxc6"],
        eco: "C68",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6",
        idea: "White gives up the bishop for the c6 knight, doubling Black's c-pawns. White aims for an endgame where the healthy kingside pawn majority can make a passed pawn, while Black relies on the bishop pair and active pieces."
      },
      {
        name: "Marshall Attack",
        keywords: ["marshall"],
        eco: "C89",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5",
        idea: "Black sacrifices a pawn with ...d5 to launch a kingside attack. After White grabs material in the center, Black's pieces swarm toward White's king with ...Bd6, ...Qh4 and ...Bg4. It's so well analysed that many White players avoid it with an early a4 or h3."
      },
      {
        name: "Closed Ruy Lopez",
        keywords: ["closed"],
        eco: "C84",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7",
        idea: "Both sides keep the tension and build slowly: White plays Re1, c3, h3 and d4 and often reroutes the knight via d2-f1-g3, while Black expands on the queenside with ...b5 and supports e5 with ...d6. It's one of the deepest strategic battles in chess."
      },
      {
        name: "Schliemann Defense",
        keywords: ["schliemann", "jaenisch", "f5"],
        eco: "C63",
        moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 f5",
        idea: "Black strikes with the aggressive ...f5, counterattacking e4 in gambit style. The positions are sharp and tactical, with Black hoping to open the f-file and grab the initiative."
      }
    ]
  },
  {
    name: "French Defense",
    keywords: ["french", "winawer"],
    eco: "C00",
    moves: "1. e4 e6",
    idea: "Black supports ...d5 with ...e6, challenging e4 straight away. The position is solid, but the pawn on e6 blocks Black's light-squared bishop, the famous 'bad French bishop'. Black's main counterattacks are ...c5 against d4 and sometimes ...f6 against e5.",
    variations: [
      {
        name: "Advance Variation",
        keywords: ["advance", "e5"],
        eco: "C02",
        moves: "1. e4 e6 2. d4 d5 3. e5",
        idea: "White grabs space with e5 and locks the center. Black attacks the base of White's pawn chain with ...c5, ...Nc6 and ...Qb6, all hitting d4, while White tries to hold d4 and use the extra space for a kingside attack."
      },
      {
        name: "Exchange Variation",
        keywords: ["exchange", "exd5"],
        eco: "C01",
        moves: "1. e4 e6 2. d4 d5 3. exd5",
        idea: "White releases the tension with exd5, giving a symmetrical pawn structure. Black's light-squared bishop is suddenly free, so equality comes easily, and the game is decided by piece activity rather than pawns."
      },
      {
        name: "Winawer Variation",
        keywords: ["winawer", "bb4"],
        eco: "C15",
        moves: "1. e4 e6 2. d4 d5 3. Nc3 Bb4",
        idea: "Black pins the c3 knight with ...Bb4. After e5, ...c5 and a3, Black usually takes on c3, giving White the bishop pair and doubled c-pawns. White attacks Black's weak dark squares on the kingside with Qg4, while Black goes after the weak queenside pawns."
      },
      {
        name: "Tarrasch Variation",
        keywords: ["tarrasch", "nd2"],
        eco: "C03",
        moves: "1. e4 e6 2. d4 d5 3. Nd2",
        idea: "White plays Nd2 instead of Nc3 to avoid the Winawer pin and keep the c-pawn free for c3. Black chooses between ...c5, often leading to an isolated d-pawn, and ...Nf6, leading to a locked center after e5."
      },
      {
        name: "Rubinstein Variation",
        keywords: ["rubinstein", "dxe4"],
        eco: "C10",
        moves: "1. e4 e6 2. d4 d5 3. Nc3 dxe4",
        idea: "Black gives up the center with ...dxe4 to free the position and simplify. Black aims for ...Nd7, ...Ngf6 and a later ...c5 against d4. It's solid but a little passive, and White enjoys more space."
      },
      {
        name: "Classical Variation",
        keywords: ["classical", "steinitz", "nf6"],
        eco: "C11",
        moves: "1. e4 e6 2. d4 d5 3. Nc3 Nf6",
        idea: "Black develops ...Nf6, attacking e4. White either pins with Bg5 or pushes e5 (the Steinitz), leading to closed positions where Black plays ...c5 and ...Nc6 against d4, sometimes adding ...f6."
      }
    ]
  },
  {
    name: "Caro-Kann Defense",
    keywords: ["carokann", "caro", "kann", "panov"],
    eco: "B10",
    moves: "1. e4 c6",
    idea: "Black prepares ...d5 with ...c6, keeping the light-squared bishop free to come out before ...e6. It's one of the most solid defenses: Black accepts a bit less space in exchange for a healthy pawn structure and easy development.",
    variations: [
      {
        name: "Advance Variation",
        keywords: ["advance", "e5"],
        eco: "B12",
        moves: "1. e4 c6 2. d4 d5 3. e5",
        idea: "White grabs space with e5. Unlike in the French, Black gets the bishop out to f5 before playing ...e6, then attacks d4 with ...c5. White often tries to hunt the f5 bishop with g4, or builds up quietly with Nf3, Be2 and c3."
      },
      {
        name: "Classical Variation",
        keywords: ["classical", "bf5"],
        eco: "B18",
        moves: "1. e4 c6 2. d4 d5 3. Nd2 dxe4 4. Nxe4 Bf5",
        idea: "Black takes on e4 and develops the bishop to f5 with tempo on the knight. White often chases it with h4-h5 and castles queenside, while Black answers with ...h6, ...Nd7 and ...e6 for a very solid position."
      },
      {
        name: "Exchange Variation",
        keywords: ["exchange", "exd5"],
        eco: "B13",
        moves: "1. e4 c6 2. d4 d5 3. exd5",
        idea: "White trades on d5 for a symmetrical structure, usually following with Bd3 and c3. Black develops with ...Nc6 and ...Bg4 or ...Bf5 and gets a comfortable, equal game."
      },
      {
        name: "Panov Attack",
        keywords: ["panov", "c4"],
        eco: "B13",
        moves: "1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4",
        idea: "White plays c4 after the trade on d5, often leading to an isolated queen's pawn position. White gets active pieces and attacking chances, while Black aims to blockade the isolated pawn and attack it later."
      },
      {
        name: "Two Knights Attack",
        keywords: ["two knights", "knights"],
        eco: "B10",
        moves: "1. e4 c6 2. Nc3 d5 3. Nf3",
        idea: "White develops both knights before committing the d-pawn, keeping options open. Black often pins the f3 knight with ...Bg4, or takes on e4 and follows with ...Nf6 for a solid set-up."
      }
    ]
  },
  {
    name: "Queen's Gambit",
    keywords: ["queens gambit", "qgd", "qga", "albin", "tarrasch"],
    eco: "D06",
    moves: "1. d4 d5 2. c4",
    idea: "White offers the c-pawn to pull Black's d5 pawn away from the center. It isn't a true gambit, because White can usually win the pawn back. The whole fight is about control of the central squares and smooth development.",
    variations: [
      {
        name: "Queen's Gambit Accepted",
        keywords: ["accepted", "qga", "dxc4"],
        eco: "D20",
        moves: "1. d4 d5 2. c4 dxc4",
        idea: "Black takes on c4, giving up the center for a while. White plays e3 or e4 and Bxc4 to win the pawn back, and Black counters with ...c5 and ...e6 to challenge White's center."
      },
      {
        name: "Exchange Variation",
        keywords: ["exchange", "carlsbad", "minority"],
        eco: "D35",
        moves: "1. d4 Nf6 2. c4 e6 3. Nc3 d5 4. cxd5",
        idea: "White trades on d5, creating the Carlsbad pawn structure. White's typical plan is the minority attack, pushing b4-b5 on the queenside, while Black looks for play in the center or on the kingside."
      },
      {
        name: "Queen's Gambit Declined",
        keywords: ["declined", "qgd", "e6"],
        eco: "D30",
        moves: "1. d4 d5 2. c4 e6",
        idea: "Black supports d5 with ...e6 and keeps a rock-solid center. The price is that Black's light-squared bishop is blocked in, so Black usually frees the position later with ...c5 or ...e5."
      },
      {
        name: "Albin Countergambit",
        keywords: ["albin", "countergambit"],
        eco: "D08",
        moves: "1. d4 d5 2. c4 e5",
        idea: "Black strikes back with ...e5 and, after the capture, pushes the pawn to d4, where it cramps White. The positions are unbalanced and full of tactical traps."
      },
      {
        name: "Tarrasch Defense",
        keywords: ["tarrasch"],
        eco: "D32",
        moves: "1. d4 d5 2. c4 e6 3. Nc3 c5",
        idea: "Black plays ...c5 and accepts an isolated d-pawn in exchange for free, active pieces and open lines. White aims to blockade the isolated pawn and win it in the long run."
      }
    ]
  },
  {
    name: "London System",
    keywords: ["london"],
    eco: "D02",
    moves: "1. d4 d5 2. Nf3 Nf6 3. Bf4",
    idea: "White sets up with d4, Nf3, Bf4 and e3, usually followed by c3, Bd3 and Nbd2. It's a system you can play against almost anything: solid, easy to learn, and often ending in a kingside attack with Ne5 and a timely h4 or Qf3.",
    variations: []
  },
  {
    name: "Scandinavian Defense",
    keywords: ["scandinavian", "center counter", "centre counter", "portuguese"],
    eco: "B01",
    moves: "1. e4 d5",
    idea: "Black attacks e4 immediately with ...d5. After exd5, Black recaptures with the queen or the knight. Black may lose some time, but gets a simple position with a clear development plan.",
    variations: [
      {
        name: "Main Line (2...Qxd5)",
        keywords: ["qxd5", "queen", "main"],
        eco: "B01",
        moves: "1. e4 d5 2. exd5 Qxd5",
        idea: "Black recaptures with the queen. White gains time with Nc3, and the queen usually retreats to a5, d6 or d8. Black follows up with ...Nf6, ...c6 and ...Bf5, reaching a solid, Caro-Kann-like structure."
      },
      {
        name: "Modern Variation",
        keywords: ["modern", "nf6"],
        eco: "B01",
        moves: "1. e4 d5 2. exd5 Nf6",
        idea: "Black delays the recapture with ...Nf6, planning to take back on d5 with the knight. White can try to hold the extra pawn with c4, or play d4 and develop, keeping a space edge."
      },
      {
        name: "Portuguese Gambit",
        keywords: ["portuguese"],
        eco: "B01",
        moves: "1. e4 d5 2. exd5 Nf6 3. d4 Bg4",
        idea: "Black gives up the d-pawn and plays ...Bg4 for fast development and piece pressure. It's sharp and tricky, and aims to punish White for any slow moves."
      }
    ]
  },
  {
    name: "King's Indian Defense",
    keywords: ["kings indian", "kid", "samisch", "saemisch", "smisch"],
    eco: "E61",
    moves: "1. d4 Nf6 2. c4 g6 3. Nc3",
    idea: "Black lets White build a big pawn center with c4, d4 and e4, then strikes back with ...e5 or ...c5. The fight is often on opposite wings: White attacks on the queenside, Black on the kingside.",
    variations: [
      {
        name: "Orthodox Variation",
        keywords: ["orthodox", "classical", "main"],
        eco: "E91",
        moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2",
        idea: "White develops naturally with Nf3 and Be2 and castles. Black plays ...e5, and after White pushes d5 the center locks. Then it's a race: Black storms the kingside with ...f5, while White breaks through on the queenside with c5."
      },
      {
        name: "Sämisch Variation",
        keywords: ["samisch", "saemisch", "smisch", "f3"],
        eco: "E80",
        moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3",
        idea: "White plays f3 to support e4, then Be3 and Qd2, sometimes followed by a kingside pawn storm. Black counters with ...c5, ...e5 or a queenside strike with ...b5."
      },
      {
        name: "Four Pawns Attack",
        keywords: ["four pawns", "f4"],
        eco: "E76",
        moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f4",
        idea: "White builds a huge center with pawns on c4, d4, e4 and f4. Black must strike fast with ...c5 or ...e5 to prove the center is over-extended."
      }
    ]
  },
  {
    name: "Slav Defense",
    keywords: ["slav", "semislav"],
    eco: "D10",
    moves: "1. d4 d5 2. c4 c6",
    idea: "Black supports d5 with ...c6, keeping the light-squared bishop free to develop outside the pawn chain. It's solid and flexible; in the main lines Black often takes on c4 and brings the bishop to f5 or g4.",
    variations: [
      {
        name: "Semi-Slav Defense",
        keywords: ["semislav", "semi", "meran", "botvinnik"],
        eco: "D43",
        moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6",
        idea: "Black combines ...c6 and ...e6 for an extremely solid center. Despite that, it can explode into wild tactics, especially in the Meran and Botvinnik systems."
      }
    ]
  },
  {
    name: "Scotch Game",
    keywords: ["scotch"],
    eco: "C44",
    moves: "1. e4 e5 2. Nf3 Nc6 3. d4",
    idea: "White opens the center immediately with d4. After ...exd4 and Nxd4, White gets space and free piece play, while Black develops quickly and puts pressure on e4 with ...Bc5 or ...Nf6.",
    variations: [
      {
        name: "Scotch Gambit",
        keywords: ["scotch gambit", "gambit", "bc4"],
        eco: "C44",
        moves: "1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bc4",
        idea: "Instead of recapturing on d4, White plays Bc4 and offers a pawn for fast development and pressure on f7. It often transposes into sharp Two Knights or Giuoco Piano lines."
      }
    ]
  },
  {
    name: "Nimzo-Indian Defense",
    keywords: ["nimzo", "nimzoindian"],
    eco: "E20",
    moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4",
    idea: "Black pins the c3 knight with ...Bb4, stopping White from playing e4 easily. Black is often happy to give up the bishop for the knight to double White's pawns. The whole opening is a fight for control of e4.",
    variations: [
      {
        name: "Classical Variation",
        keywords: ["classical", "qc2"],
        eco: "E32",
        moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2",
        idea: "White plays Qc2 so that if Black takes on c3, the queen recaptures and White avoids doubled pawns. White keeps the bishop pair but loses a little time, and Black aims for quick development and central play."
      },
      {
        name: "Rubinstein System",
        keywords: ["rubinstein", "e3"],
        eco: "E40",
        moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3",
        idea: "White develops calmly with e3, Bd3 and Nf3 or Ne2. White is often willing to accept doubled c-pawns in exchange for the bishop pair and a strong center."
      }
    ]
  },
  {
    name: "Queen's Indian Defense",
    keywords: ["queens indian", "qid"],
    eco: "E12",
    moves: "1. d4 Nf6 2. c4 e6 3. Nf3 b6",
    idea: "Black fianchettoes the queen's bishop on b7 to control e4. It's solid and positional; White often plays g3 and Bg2 to fight over the long diagonal.",
    variations: []
  },
  {
    name: "Grünfeld Defense",
    keywords: ["grunfeld", "gruenfeld", "grnfeld"],
    eco: "D80",
    moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5",
    idea: "Black invites White to build a big center, then attacks it with ...d5, ...Bg7 and ...c5. Black relies on piece pressure, especially the g7 bishop, against White's d4 pawn.",
    variations: [
      {
        name: "Exchange Variation",
        keywords: ["exchange", "cxd5"],
        eco: "D85",
        moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5",
        idea: "White trades on d5 and builds a big center with e4. Black piles pressure on d4 with ...Bg7, ...c5 and ...Nc6, and the game hinges on whether White's center is a strength or a target."
      }
    ]
  },
  {
    name: "English Opening",
    keywords: ["english", "anglo", "angloindian"],
    eco: "A10",
    moves: "1. c4",
    idea: "White fights for d5 from the side with c4, like a Sicilian with the colours reversed. It's flexible and positional, and White often fianchettoes the bishop on g2.",
    variations: [
      {
        name: "Symmetrical Variation",
        keywords: ["symmetrical", "c5"],
        eco: "A30",
        moves: "1. c4 c5",
        idea: "Black mirrors with ...c5. Both sides often fianchetto and fight over the d5 and d4 squares in a slow, strategic game."
      },
      {
        name: "King's English Variation",
        keywords: ["kings english", "reversed", "e5"],
        eco: "A20",
        moves: "1. c4 e5",
        idea: "Black plays ...e5, giving a Reversed Sicilian where White has an extra move. White fights for d5 with Nc3, g3 and Bg2."
      },
      {
        name: "Anglo-Indian Defense",
        keywords: ["anglo", "angloindian", "nf6"],
        eco: "A15",
        moves: "1. c4 Nf6",
        idea: "Black replies with ...Nf6 and stays flexible. The game often transposes into 1.d4 openings like the King's Indian or the Nimzo-Indian."
      }
    ]
  },
  {
    name: "Catalan Opening",
    keywords: ["catalan"],
    eco: "E00",
    moves: "1. d4 Nf6 2. c4 e6 3. g3",
    idea: "White combines d4 and c4 with a fianchettoed bishop on g2, putting long-term pressure on the long diagonal and Black's queenside. It's a positional opening favoured by many top players.",
    variations: [
      {
        name: "Open Catalan",
        keywords: ["open", "dxc4"],
        eco: "E01",
        moves: "1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2",
        idea: "Black takes on c4, and White aims to win the pawn back with Qa4+ or Qc2. Meanwhile the g2 bishop presses hard along the diagonal."
      },
      {
        name: "Closed Catalan",
        keywords: ["closed", "be7"],
        eco: "E06",
        moves: "1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7 5. Nf3",
        idea: "Black holds the center with ...d5 and ...e6 without taking on c4. It leads to a slow manoeuvring game where Black must find a way to free the c8 bishop."
      }
    ]
  },
  {
    name: "Dutch Defense",
    keywords: ["dutch", "leningrad", "stonewall"],
    eco: "A80",
    moves: "1. d4 f5",
    idea: "Black controls e4 with ...f5 and aims for kingside play. It's ambitious and unbalancing, but it weakens Black's king, so Black has to be careful.",
    variations: [
      {
        name: "Leningrad Variation",
        keywords: ["leningrad", "g6"],
        eco: "A86",
        moves: "1. d4 f5 2. c4 Nf6 3. g3 g6",
        idea: "Black fianchettoes on g7, mixing the Dutch with King's Indian ideas. Black usually aims for ...e5 and play on the kingside."
      },
      {
        name: "Stonewall Variation",
        keywords: ["stonewall", "d5"],
        eco: "A92",
        moves: "1. d4 f5 2. c4 Nf6 3. g3 e6 4. Bg2 Be7 5. Nf3 O-O 6. O-O d5",
        idea: "Black sets up pawns on c6, d5, e6 and f5 for a rock-solid structure. Black aims for a kingside attack but has to watch out for White's knight landing on the weak e5 square."
      },
      {
        name: "Classical Variation",
        keywords: ["classical", "e6"],
        eco: "A84",
        moves: "1. d4 f5 2. c4 e6",
        idea: "Black plays ...e6 and ...Be7 and stays flexible. A typical attacking plan is to bring the queen to the kingside via e8 and h5."
      }
    ]
  },
  {
    name: "Vienna Game",
    keywords: ["vienna"],
    eco: "C25",
    moves: "1. e4 e5 2. Nc3",
    idea: "White develops the queen's knight first, keeping the option of a later f4. The idea is to push f4 under better circumstances than in the King's Gambit, or to play a quieter game with Bc4 and d3.",
    variations: [
      {
        name: "Vienna Gambit",
        keywords: ["vienna gambit", "gambit", "f4"],
        eco: "C29",
        moves: "1. e4 e5 2. Nc3 Nf6 3. f4",
        idea: "White pushes f4 to open the f-file and challenge Black's e5 pawn. Black's best answer is often ...d5, striking in the center; if Black is careless, White gets a strong center and an attack."
      }
    ]
  },
  {
    name: "King's Gambit",
    keywords: ["kings gambit", "falkbeer"],
    eco: "C30",
    moves: "1. e4 e5 2. f4",
    idea: "White offers the f-pawn to open the f-file and pull Black's e5 pawn away, hoping to build a big center with d4. It's one of the oldest and most romantic openings: sharp, risky and full of attacking chances for both sides.",
    variations: [
      {
        name: "King's Gambit Accepted",
        keywords: ["accepted", "exf4"],
        eco: "C33",
        moves: "1. e4 e5 2. f4 exf4",
        idea: "Black takes the pawn. White plays for quick development, the open f-file and a strong center with d4, while Black either tries to hang on to the pawn with ...g5 or gives it back with ...d5 for easy development."
      },
      {
        name: "Falkbeer Countergambit",
        keywords: ["falkbeer", "countergambit"],
        eco: "C31",
        moves: "1. e4 e5 2. f4 d5",
        idea: "Black declines with a counter-gambit, striking the center with ...d5. The idea is to punish White's loosened kingside and open lines before White can use the f-file."
      },
      {
        name: "King's Gambit Declined",
        keywords: ["declined", "classical", "bc5"],
        eco: "C30",
        moves: "1. e4 e5 2. f4 Bc5",
        idea: "Black calmly develops ...Bc5, which controls g1 and makes it hard for White to castle kingside. Black simply refuses the pawn and keeps a solid, flexible position."
      }
    ]
  },
  {
    name: "Pirc Defense",
    keywords: ["pirc"],
    eco: "B00",
    moves: "1. e4 d6",
    idea: "Black lets White build a big center and then attacks it with pieces. Black fianchettoes on g7, castles, and strikes back later with ...c5 or ...e5.",
    variations: [
      {
        name: "Austrian Attack",
        keywords: ["austrian", "f4"],
        eco: "B09",
        moves: "1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. f4",
        idea: "White builds a huge pawn center with e4, d4 and f4, aiming for e5 or a kingside attack. Black must counter quickly in the center with ...c5 or ...e5."
      }
    ]
  },
  {
    name: "Alekhine Defense",
    keywords: ["alekhine", "alekhines"],
    eco: "B02",
    moves: "1. e4 Nf6",
    idea: "Black provokes White's pawns forward by attacking e4 with the knight. The idea is that the advanced pawns become targets, which Black attacks with ...d6, ...c5 and pieces.",
    variations: [
      {
        name: "Four Pawns Attack",
        keywords: ["four pawns", "f4"],
        eco: "B03",
        moves: "1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. c4 Nb6 5. f4",
        idea: "White pushes c4, d4, e5 and f4 for a massive center. If the center holds, White is much better; if Black undermines it, the pawns turn into weaknesses."
      },
      {
        name: "Modern Variation",
        keywords: ["modern", "nf3"],
        eco: "B04",
        moves: "1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3",
        idea: "White plays calmly with Nf3 instead of over-extending. White keeps a solid space advantage, while Black often pins the knight with ...Bg4 and pressures the e5 pawn."
      }
    ]
  },
  {
    name: "Petrov's Defense",
    keywords: ["petrov", "petrovs", "petroff", "russian"],
    eco: "C42",
    moves: "1. e4 e5 2. Nf3 Nf6",
    idea: "Black counterattacks e4 with ...Nf6 instead of defending e5. It's very solid and symmetrical, but Black must not copy White blindly: after 3.Nxe5, Black should play ...d6 first before taking on e4.",
    variations: []
  },
  {
    name: "Philidor Defense",
    keywords: ["philidor"],
    eco: "C41",
    moves: "1. e4 e5 2. Nf3 d6",
    idea: "Black defends e5 with ...d6, building a solid but cramped position. Black usually develops with ...Nf6, ...Nbd7 and ...Be7 and holds on to e5, while White enjoys more space.",
    variations: []
  },
  {
    name: "Four Knights Game",
    keywords: ["four knights"],
    eco: "C47",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6",
    idea: "Both sides bring their knights to natural squares. It's symmetrical and solid; White often continues with Bb5 or d4, and the game depends on who uses the center better.",
    variations: []
  },
  {
    name: "Bishop's Opening",
    keywords: ["bishops opening"],
    eco: "C23",
    moves: "1. e4 e5 2. Bc4",
    idea: "White develops the bishop to c4 first, aiming at f7 and keeping the f-pawn free for f4. It often transposes into the Italian or the Vienna, but it sidesteps the Petrov.",
    variations: []
  },
  {
    name: "Modern Defense",
    keywords: ["modern defense", "modern defence", "robatsch"],
    eco: "B06",
    moves: "1. e4 g6",
    idea: "Black fianchettoes on g7 without committing the knight to f6, keeping every option open. Black invites White to build a center, then strikes it with ...c5, ...d6 and ...e5.",
    variations: []
  },
  {
    name: "Colle System",
    keywords: ["colle"],
    eco: "D04",
    moves: "1. d4 d5 2. Nf3 Nf6 3. e3",
    idea: "White sets up with d4, Nf3, e3 and Bd3, aiming to push e4 later. It's solid and simple, and White often attacks the kingside once the center opens.",
    variations: []
  },
  {
    name: "Trompowsky Attack",
    keywords: ["trompowsky", "trompovsky", "trompo"],
    eco: "A45",
    moves: "1. d4 Nf6 2. Bg5",
    idea: "White attacks the f6 knight with Bg5 right away, avoiding a lot of main-line theory. White aims to double Black's pawns or disrupt Black's development.",
    variations: []
  },
  {
    name: "Réti Opening",
    keywords: ["reti", "rti"],
    eco: "A09",
    moves: "1. Nf3 d5 2. c4",
    idea: "White combines Nf3 and c4, controlling the center from the side rather than occupying it with pawns. It's flexible and positional, and White often fianchettoes on g2.",
    variations: []
  },
  {
    name: "Bogo-Indian Defense",
    keywords: ["bogo", "bogoindian"],
    eco: "E11",
    moves: "1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+",
    idea: "Black checks with ...Bb4+, similar to the Nimzo-Indian but after White has played Nf3 instead of Nc3. It's solid; Black often aims to trade the dark-squared bishops and develop simply.",
    variations: []
  },
  {
    name: "Modern Benoni",
    keywords: ["benoni"],
    eco: "A60",
    moves: "1. d4 Nf6 2. c4 c5 3. d5 e6",
    idea: "Black allows White a space advantage in return for a queenside pawn majority and active pieces. Black plays ...e6, ...exd5, ...d6 and ...g6, and aims for ...b5.",
    variations: []
  },
  {
    name: "Benko Gambit",
    keywords: ["benko", "volga"],
    eco: "A57",
    moves: "1. d4 Nf6 2. c4 c5 3. d5 b5",
    idea: "Black sacrifices the b-pawn to open the a- and b-files for long-term queenside pressure. Black's rooks and the fianchettoed g7 bishop all aim at White's queenside.",
    variations: []
  },
  {
    name: "Budapest Gambit",
    keywords: ["budapest"],
    eco: "A51",
    moves: "1. d4 Nf6 2. c4 e5",
    idea: "Black offers a pawn with ...e5 for active piece play. Black usually wins the pawn back on e5 with ...Ng4 and ...Nc6, while White tries to hold on to it.",
    variations: []
  },
  {
    name: "Bird Opening",
    keywords: ["bird", "birds", "froms"],
    eco: "A02",
    moves: "1. f4",
    idea: "White controls e5 with f4, like a Dutch Defense with the colours reversed. White aims for kingside play but has to be careful about the loosened king.",
    variations: [
      {
        name: "From's Gambit",
        keywords: ["froms", "gambit", "e5"],
        eco: "A02",
        moves: "1. f4 e5",
        idea: "Black sacrifices a pawn with ...e5 to open lines against White's weakened kingside. It's sharp and tactical, and White must defend accurately."
      }
    ]
  },
  {
    name: "Blackmar-Diemer Gambit",
    keywords: ["blackmar", "diemer", "blackmardiemer", "bdg"],
    eco: "D00",
    moves: "1. d4 d5 2. e4",
    idea: "White sacrifices a pawn with e4 and later f3 to open the f-file and attack quickly. It's sharp and risky, and very popular in fast online games.",
    variations: []
  },
  {
    name: "Danish Gambit",
    keywords: ["danish"],
    eco: "C21",
    moves: "1. e4 e5 2. d4 exd4 3. c3",
    idea: "White sacrifices one or even two pawns for rapid development and attacking chances against f7. Black can accept and defend, or give material back to reach a safe position.",
    variations: []
  },
  {
    name: "Englund Gambit",
    keywords: ["englund"],
    eco: "A40",
    moves: "1. d4 e5",
    idea: "Black offers a pawn with ...e5, hoping for tricks and traps. It's objectively dubious, but it can be dangerous in fast games if White doesn't know the traps.",
    variations: []
  },
  {
    name: "Center Game",
    keywords: ["center game", "centre game"],
    eco: "C20",
    moves: "1. e4 e5 2. d4",
    idea: "White opens the center with d4 and recaptures on d4 with the queen. The queen can be hit by ...Nc6, costing White time, but White aims for quick development and castling queenside.",
    variations: []
  },
  {
    name: "Ponziani Opening",
    keywords: ["ponziani"],
    eco: "C44",
    moves: "1. e4 e5 2. Nf3 Nc6 3. c3",
    idea: "White plays c3 to prepare d4 and build a strong center. It's rarer than the Italian or Ruy Lopez, and Black can counter actively with ...d5 or ...Nf6.",
    variations: []
  },
  {
    name: "Nimzowitsch Defense",
    keywords: ["nimzowitsch", "nimzovich"],
    eco: "B00",
    moves: "1. e4 Nc6",
    idea: "Black develops ...Nc6 immediately, inviting White to take the center. It's offbeat; Black aims to challenge the center later with ...d5 or ...e5.",
    variations: []
  },
  {
    name: "Owen Defense",
    keywords: ["owen", "owens"],
    eco: "B00",
    moves: "1. e4 b6",
    idea: "Black fianchettoes the queen's bishop straight away with ...b6, aiming it at e4. It's offbeat, and Black gives White a free hand in the center.",
    variations: []
  }
];
//---------------------------------------------------------------
