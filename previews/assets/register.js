/* Suchetana Electricals — the register. Verified against
   E:\Suchetana-Electricals-Company-Profile-2026.pdf (73 projects, 9 sectors).
   Private residences carry locality + load only, no owner names.
   Fields: [sectorId, name, locality, load, credit/scope, isKey] */

const SECTORS = [
  {id:'it',   name:'IT companies & office space'},
  {id:'gov',  name:'Government projects'},
  {id:'hos',  name:'Hospitals'},
  {id:'cpx',  name:'Complex centres'},
  {id:'ind',  name:'Industrial & factory'},
  {id:'res',  name:'Restaurants & entertainment'},
  {id:'apt',  name:'Apartments, villas & houses'},
  {id:'shw',  name:'Showrooms'},
  {id:'key',  name:'Key & ongoing projects'}
];

const P = [
["it","Azim Premji Foundation","Sarjapura Road","200 KVA","IMG Consultant · M/s. Sripakesh",0],
["it","Silver Software Pvt. Ltd.","ITPL, Whitefield","750 KVA","Upal Ghosh & Associates · Suresh Consultant",0],
["it","VeriFone Communications","Kumara Park West","200 KVA","Gayathri &amp; Namith · Epithelial Engineering",0],
["it","Azim Premji Investments","Sarjapura Road","100 KVA","IMG Consultant · M/s. Sripakesh",0],
["it","ADC India Communication — R&amp;D","Outer Ring Road, BSK 2nd Stage","650 KVA","Elysees Interior · 56,000 sq ft, 450 workstations",0],
["it","Frontier Business System","Wood Street, off Brigade Road","200 KVA","Gayathri &amp; Namith · Entask Consultancy",0],
["it","India Heritage of ISKCON","Rajajinagar","—","Gayathri &amp; Namith · six floors, 95 workstations",0],
["it","DEN Pvt. Ltd.","K.R. Road","350 KVA","Flora Arcade · 175 workstations, 10,000 sq ft",0],
["it","MRO-TEK Pvt. Ltd.","Bellary Road, Hebbal","1000 KVA","630 A 11 KV VCB · HT cable 275 m",1],
["it","ADC India Communication — Krone","Peenya 2nd Stage","100 KVA","Elysees Interior · self-execution LT supply",0],
["it","FERN Builders &amp; Developers","Indiranagar &amp; Koramangala","—","Upal Ghosh · 35,000 sq ft landscape electrification",0],
["it","KLE Institution","Nagarbhavi","100 KVA","Flora Arcade · 75 workstations",0],
["it","Mantri Mall Management Office","Malleshwaram","—","A.N. Prakash &amp; Associates (PMC) · 10,000 sq ft",0],
["it","Hinduja Group — DMR Enterprises","Bellary Road","160 KVA","GSA Studio · Tandem Consultant",0],
["it","Ramsons Garment Finishings","Sarjapura Road","250 KVA","GSA Studio · Tandem Consultant",0],
["it","Rossell Techsys","Whitefield","500 KVA","Elysees Interiors · HT power supply",0],
["it","Rossell Techsys — Phase 2","Whitefield","250 KVA","Elysees Interiors · 48,000 sq ft",0],

["gov","2 × 8 MW, 66/11 KV Sub-Station","Chitradurga, Karnataka","16 MVA","State sub-station erection",1],
["gov","2 × 5 MVA, 110/33 KV Sub-Station","Ranebennur Taluk, Karnataka","10 MVA","Rattihalli to 33 KV sub-station",1],
["gov","Commercial Tax Office","Hubli, Karnataka","100 KVA","11 KV double-pole overhead line, 35 m",0],
["gov","Police Quarters","Koramangala","250 KVA","Transformer erection",0],
["gov","Karnataka Housing Board","Koramangala","250 KVA","Transformer erection",0],
["gov","Karnataka Housing Board","Kumbalgodu, Mysore Road","250 KVA","Transformer erection",0],
["gov","Gulmohar Enclave","Marathahalli","250 KVA","Layout works · 11 KV overhead line",0],
["gov","Herohalli Layout","Magadi Road","—","Layout works · 11 KV line and street lighting",0],

["hos","Gunasheela Nursing Home","Basavanagudi","500 KVA","Gayathri &amp; Namith · HT enhancement, live facility",1],
["hos","Gunasheela Trinity Hospital","Basavanagudi","500 KVA","Gayathri &amp; Namith · HT enhancement, live facility",0],

["cpx","Swastik Complex","Sheshadripuram, S.C. Road","500 KVA","Divakar &amp; Associates · 500 KVA × 2",0],
["cpx","Tallam Arcade (Geetha Complex)","S.C. Road, Majestic Circle","500 KVA","HT cable 475 m on a loop with police station and cinema",1],
["cpx","Abhinay Complex &amp; Cinema Hall","B.V.K. Iyengar Road","250 KVA","Transformer, HT cubicle, HT cable 110 m",0],
["cpx","Commercial complex","Marathahalli","250 KVA","Sathendra Bathkal &amp; Associates",0],
["cpx","Commercial complex","Kumara Park West","200 KVA","Gayathri &amp; Namith · LBS and ring main unit",0],

["ind","Ankith Garments","Bommasandra Industrial Area","250 KVA","Aminbhavi &amp; Hegde · Sai Engineers",0],
["ind","Venkateshwara Garments","Hoskote Industrial Area","250 KVA","Sai Engineers",0],

["res","Hotel Empire — Restaurant &amp; Lodging","Castle Street, Richmond Road","315 KVA","Martin Antony Njavally · LBS and ring main unit",1],
["res","HM Leisure — Amoeba","Mantri Square","125 KVA","Manah Studio · Nugy Consultancy · 25,000 sq ft",0],
["res","Shram Enterprises — Shiv Sagar","Mantri Square","120 KVA","GSA Studio · Tandem Consultant · 17,000 sq ft",0],
["res","Shram Enterprises — Riverside","Whitefield Main Road","160 KW","GNA Architects · Panchamukhi · 10,000 sq ft",0],
["res","Shram Enterprises — Shiv Sagar","Commercial Street","70 KW","GSA Studio · Tandem Consultant · 8,000 sq ft",0],
["res","Red Apple Kitchen — Toscano","Orion Mall, Yeshwanthpur","70 KW","RC Architects · JES Design Consultant",0],
["res","Beijing Bites / Chungs","Five branches across Bengaluru","—","Satish Naik &amp; Associates · 2,500 sq ft per branch",0],
["res","ISKCON Charity","Rajajinagar","—","Gayathri &amp; Namith · stilt and ground, 3,000 sq ft each",0],

["apt","Godrej Properties — Gold County","Tumkur Road","—","P.G. Patki Architects · Procon Engineers · villas",1],
["apt","GR Constructions — Singasandra","Hosur Road","250 KVA","Design Attitude · Sai Pranava · 96 flats",0],
["apt","Emmanuel Constructions — Angle Arch","Kammasandra, Hosur Road","250 KVA","Gayathri &amp; Namith · 24 villas, transformer on spun pole",0],
["apt","Build Mart — Rathod Land Mark","Bengaluru","250 KVA","Ecumene Habitat · JES Design · 40 flats + commercial",0],
["apt","Build Mart — Ratio Vatika","Bengaluru","250 KVA","Aslam Architects · Suyog Consultants · 20 flats",0],
["apt","Apartments at Primrose Road","M.G. Road Cross","250 KVA","Divakar &amp; Associates",0],
["apt","Emmanuel Constructions — Emmanuel Pearl","Rest House Road, off Brigade Road","100 KVA","Team 2 Architects · Pie Consultancy · 100 KVA × 2",0],
["apt","Emmanuel Constructions — Emmanuel Nest","K.R. Puram","100 KVA","Maya Architect · SAN Consultant · 12 flats",0],
["apt","K.V. Properties — layout","O Farm, 7-acre layout","100 KVA","Interface, Domlur · 18 units, spun-pole transformer",0],
["apt","Apartment building","Horamavu, Outer Ring Road","80 KVA","Praxis Inc. · Epithelial Engineering · spun-pole HT",0],
["apt","Apartment building","Sanjaynagar","75 KVA","In-house · LT supply",0],
["apt","Transformer shifting","J.P. Nagar 2nd Phase","250 KVA","11 KV line 125 m, double-pole structure",0],
["apt","Private residence","Palace Cross Road","44 KVA","GNA Architects · Poorna Consultants",0],
["apt","Residential bungalow","West of Chord Road, Rajajinagar","40 KVA","Proposed supply",0],
["apt","Residential bungalow","Boopsandra","40 KVA","Ecumene Solution · JES Design Consultants",0],
["apt","Residential bungalow","Jayanagar","30 KVA","Nugy Consultancy · smallest recorded supply",1],

["shw","Golden Properties — Toy Showroom","Bengaluru","350 KVA","Five floors of 4,000 sq ft each",1],
["shw","Fab India Overseas","Mantri Square","—","Ecumene Solution · 5,000 sq ft interior",0],
["shw","Favourite Shop — Manyavar","Mantri Square","—","Choreography of Spaces · 5,000 sq ft",0],
["shw","Kids Favourite Shop","Mantri Square","—","Choreography of Spaces · 5,000 sq ft",0],
["shw","Mahaveer Bath Solution — Jaquar","Hyderabad","—","Creo Concept · sanitary ware showroom",0],
["shw","Cosmo Lighting — Jaquar","Hyderabad","—","Creo Concept · lighting showroom",0],
["shw","Krishna Enterprises — Jaquar","Hyderabad","—","Creo Concept · sanitary ware showroom",0],

["key","JN Constructions — Atomic Minerals Directorate","AMD Complex, Nagarbhavi","—","Govt. of India · DCSEM, Anushaktinagar · Phase II",1],
["key","A3 Developers","Papareddypalya, Nagarbhavi","250 KVA","Goutham Venkatesh Architects · 129 KW LT",0],
["key","Sri Sathyanarayana &amp; Sons","Railway Parallel Road, Sheshadripuram","200 KVA","Sublime Architects · 16,000 sq ft, plus 100 KVA LT",0],
["key","M/s. Global Calcium Pvt. Ltd.","Koramangala","160 KVA","PR Design Group · 12,000 sq ft commercial",0],
["key","Residential apartments","Girls School Street, Sheshadripuram","100 KVA","Flora Arcade · 12 flats of 2,400 sq ft",0],
["key","Private residence","Bengaluru","100 KVA","OCD Architects · LT power supply",0],
["key","Twin residential bungalows","Boopsandra, Sanjaynagar","60 KVA","Tejesh Architect · LT power supply",0],
["key","Tenova Delkor Pvt. Ltd.","Tumkur–Bengaluru Road","50 KW","Celebrity Interiors · 50 workstations",0]
];
