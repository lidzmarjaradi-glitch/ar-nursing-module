// ═══════════════════════════════════════════════════════
// data.js — Structure info, mesh details & legend metadata
// ═══════════════════════════════════════════════════════

const structureInfo = {
    heart: {
        'Right Atrium': 'Receives deoxygenated blood from the body via the superior and inferior vena cava. Key landmark for central line placement.',
        'Left Atrium': 'Receives oxygenated blood from the lungs via pulmonary veins. Critical for assessing left heart function.',
        'Right Ventricle': 'Pumps deoxygenated blood to the lungs. Assessed for right heart failure and pulmonary hypertension.',
        'Left Ventricle': 'The heart\'s main pumping chamber. Most muscular chamber, pumps oxygenated blood to entire body.',
        'Aorta': 'Main artery carrying oxygenated blood from the heart to the body. Site for blood pressure measurement.',
        'Pulmonary Artery': 'Carries deoxygenated blood from right ventricle to lungs. Only artery that carries deoxygenated blood.',
        'Superior Vena Cava': 'Returns deoxygenated blood from the upper body. Critical landmark for central venous catheter placement.',
        'Coronary Vessels': 'Arteries and veins supplying the heart muscle. Occlusion causes myocardial infarction.'
    },
    lungs: {
        'Trachea': 'The windpipe connecting throat to lungs. Site for intubation and airway management.',
        'Bronchi': 'Main airways branching from trachea to each lung. Right bronchus is wider and shorter.',
        'Bronchioles': 'Smaller airways distributing air throughout lungs. Affected in asthma and bronchitis.',
        'Alveoli': 'Tiny air sacs where gas exchange occurs. Essential for oxygen absorption and CO2 removal.',
        'Pleura': 'Membrane surrounding lungs. Fluid accumulation causes pleural effusion.',
        'Diaphragm': 'Main muscle of respiration. Contracts during inhalation to expand lung cavity.'
    },
    kidney: {
        'Kidney (concept model)': 'Whole-organ Sketchfab model for orientation (3D Ginjal Concept, CC BY 4.0). Pair with diagrams or a multi-part kidney for cortex, medulla, and vessels.',
        'Structure': 'See legend for this model’s single mesh description.'
    },
    brain: {
        'Cerebrum': 'Largest part controlling conscious thought, movement, and sensation. Divided into two hemispheres.',
        'Cerebellum': 'Coordinates movement and balance. Damage causes ataxia and coordination problems.',
        'Brain Stem': 'Controls vital functions: breathing, heart rate, consciousness. Damage is often fatal.',
        'Frontal Lobe': 'Controls executive function, personality, and motor control. Damaged in frontal lobe syndrome.',
        'Temporal Lobe': 'Processes auditory information and memory. Seizures often originate here.',
        'Occipital Lobe': 'Processes visual information. Damage causes visual field defects.'
    },
    syringe: {
        'Barrel': 'Main cylinder holding medication. Marked with volume graduations for accurate dosing.',
        'Plunger': 'Creates suction/pressure to draw or inject fluid. Must move smoothly without resistance.',
        'Needle Hub': 'Colored cap indicating needle gauge. Different colors for different gauges.',
        'Needle Shaft': 'Hollow metal tube for injection. Gauge determines thickness (smaller number = thicker).',
        'Bevel': 'Angled tip for smooth penetration. Always insert bevel-up for comfort and success.',
        'Graduation Marks': 'Volume measurements on barrel. Essential for accurate medication dosing.'
    },
    liver: {
        'Right Lobe': 'Largest lobe of the liver. Primary site for drug metabolism via cytochrome P450 enzymes. Palpable below the right costal margin.',
        'Left Lobe': 'Smaller, flatter lobe extending across the midline. Important landmark in abdominal assessment.',
        'Caudate Lobe': 'Posterior lobe receiving blood from both portal vein and hepatic artery. Often spared in cirrhosis due to dual supply.',
        'Quadrate Lobe': 'Inferior lobe between gallbladder fossa and round ligament. Functionally part of the left lobe.',
        'Gallbladder': 'Pear-shaped sac storing bile. Murphy\'s sign (inspiratory arrest on palpation) indicates cholecystitis.',
        'Hepatic Artery': 'Supplies oxygenated blood (~25% of hepatic blood flow). Critical in liver transplant surgery.',
        'Portal Vein': 'Carries nutrient-rich blood from the GI tract (~75% of hepatic blood flow). Portal hypertension causes varices.',
        'Common Bile Duct': 'Drains bile from liver and gallbladder to duodenum. Obstruction causes jaundice.'
    },
    stomach: {
        'Fundus': 'Upper dome-shaped portion above the cardiac notch. Collects swallowed air; visible on X-ray as gastric bubble.',
        'Cardia': 'Junction where esophagus meets stomach. Lower esophageal sphincter prevents acid reflux (GERD).',
        'Body': 'Main central region containing parietal cells (HCl) and chief cells (pepsinogen). Primary digestive chamber.',
        'Pylorus': 'Narrow distal region connecting to duodenum. Pyloric stenosis in infants causes projectile vomiting.',
        'Greater Curvature': 'Convex lateral border. Attachment for greater omentum; site for gastric sleeve surgery.',
        'Lesser Curvature': 'Concave medial border. Most common site for gastric ulcers; supplied by left gastric artery.',
        'Rugae': 'Internal mucosal folds allowing stomach expansion. Flatten when stomach is full.',
        'Pyloric Sphincter': 'Muscular valve controlling gastric emptying into duodenum. Regulates chyme release rate.'
    },
    eye: {
        'Sclera': 'Tough white outer coat maintaining eye shape. Jaundice causes yellow scleral discoloration (icterus).',
        'Cornea': 'Transparent anterior surface providing ~2/3 of eye\'s refractive power. Corneal reflex tests CN V and VII.',
        'Iris': 'Colored muscular diaphragm controlling pupil size. Pupil assessment (PERRLA) is key in neurological exams.',
        'Pupil': 'Central aperture for light entry. Constriction/dilation reflects autonomic function and intracranial pressure.',
        'Lens': 'Biconvex transparent structure for fine focus. Cataracts (clouding) are the leading cause of reversible blindness.',
        'Retina': 'Light-sensitive neural layer containing rods and cones. Diabetic retinopathy is a major complication of diabetes.',
        'Optic Nerve': 'Cranial nerve II carrying visual signals to brain. Papilledema (optic disc swelling) indicates raised ICP.',
        'Vitreous Body': 'Clear gel filling posterior chamber. Floaters and flashes may indicate retinal detachment—an emergency.'
    },
    tooth: {
        'Enamel': 'Hardest substance in the body covering the crown. Erosion from acid/bacteria causes dental caries.',
        'Dentin': 'Yellowish layer beneath enamel forming bulk of tooth. Contains tubules transmitting pain sensation.',
        'Pulp Chamber': 'Central cavity containing nerves and blood vessels. Infection here causes pulpitis and severe toothache.',
        'Root Canal': 'Channel within the root carrying neurovascular supply. Root canal therapy removes infected pulp tissue.',
        'Crown': 'Visible portion above the gum line. Shape varies by tooth type (incisor, canine, premolar, molar).',
        'Root': 'Embedded portion anchoring tooth in alveolar bone. Root fractures require extraction.',
        'Cementum': 'Thin calcified layer covering the root surface. Anchors periodontal ligament fibers.',
        'Gingiva': 'Mucosal tissue surrounding tooth necks. Gingivitis (inflammation) is early periodontal disease.'
    },
    spine: {
        'Vertebral Body': 'Weight-bearing anterior block. Compression fractures common in osteoporosis; assess with vertebral height.',
        'Intervertebral Disc': 'Fibrocartilage pad between vertebrae absorbing shock. Herniation can compress spinal nerves causing radiculopathy.',
        'Spinous Process': 'Posterior projection palpable along midline. Landmark for lumbar puncture (L3-L4 interspace).',
        'Transverse Process': 'Lateral projections for muscle and ligament attachment. Fractures indicate high-energy trauma.',
        'Spinal Canal': 'Central passage protecting the spinal cord. Stenosis causes neurogenic claudication and myelopathy.',
        'Pedicle': 'Bony bridge connecting vertebral body to posterior arch. Entry point for pedicle screw fixation in spinal surgery.',
        'Lamina': 'Flat plate forming posterior canal wall. Laminectomy removes this to decompress the spinal cord.',
        'Facet Joint': 'Synovial joints guiding vertebral motion. Degeneration causes facet arthropathy and back pain.'
    },
    skin: {
        'Epidermis': 'Outermost layer providing waterproof barrier. Keratinocytes migrate from basal layer to surface in ~28 days.',
        'Dermis': 'Structural layer containing collagen, elastin, nerves, and vessels. Wound depth to dermis = partial-thickness burn.',
        'Hypodermis': 'Subcutaneous fat layer for insulation and cushioning. Subcutaneous injection site (insulin, heparin).',
        'Hair Follicle': 'Invagination producing hair shaft. Folliculitis (infection) and ingrown hairs are common nursing concerns.',
        'Sweat Gland': 'Eccrine glands for thermoregulation via evaporative cooling. Assess diaphoresis in cardiac/shock patients.',
        'Sebaceous Gland': 'Produces sebum lubricating skin and hair. Overproduction contributes to acne; blocked glands form cysts.',
        'Blood Vessel': 'Dermal capillaries regulate temperature and supply nutrients. Capillary refill time >2s suggests poor perfusion.',
        'Nerve Ending': 'Sensory receptors for touch, pain, temperature, and pressure. Assess dermatome sensation in neurological exams.'
    },
    skull: {
        'Frontal Bone': 'Forms the forehead and superior orbits. Contains frontal sinuses. Site of frontal lobe protection.',
        'Parietal Bone': 'Paired bones forming superior and lateral skull. Contains parietal eminence landmark for assessment.',
        'Temporal Bone': 'Houses the middle and inner ear structures. Contains mastoid process landmark for antibiotic injection.',
        'Occipital Bone': 'Forms posterior cranial fossa. Contains foramen magnum for spinal cord passage.',
        'Sphenoid Bone': 'Butterfly-shaped bone at skull base. Contains sella turcica housing the pituitary gland.',
        'Mandible': 'Largest facial bone, forming the lower jaw. Only movable skull bone; assessed for TMJ disorders.',
        'Maxilla': 'Forms the upper jaw and hard palate. Contains maxillary sinuses; important for dental assessment.',
        'Zygomatic Bone': 'Forms the cheekbone prominence. Important facial landmark for assessment of facial fractures.'
    },
    hip_joint: {
        'Femoral Head': 'Spherical head of femur articulating with acetabulum. Vulnerable to avascular necrosis.',
        'Acetabulum': 'Cup-shaped socket of pelvis receiving the femoral head. Deepened by the labrum for stability.',
        'Femoral Neck': 'Narrow region connecting femoral head to shaft. Most common site of hip fractures in elderly.',
        'Greater Trochanter': 'Lateral bony prominence for gluteal muscle attachment. Landmark for IM injection site.',
        'Labrum': 'Fibrocartilage ring deepening the acetabulum. Tears cause clicking, pain, and instability.',
        'Joint Capsule': 'Fibrous capsule enclosing the joint. Contains synovial membrane producing lubricating fluid.',
        'Ligamentum Teres': 'Intra-articular ligament from acetabular fossa to femoral head. Carries artery to femoral head.',
        'Ilium': 'Largest pelvic bone forming superior acetabulum. Iliac crest is palpable landmark for procedures.'
    },
    knee_joint: {
        'Femoral Condyle': 'Rounded distal femur surfaces articulating with tibia. Weight-bearing surface prone to cartilage wear.',
        'Tibial Plateau': 'Flat superior tibia surface receiving femoral condyles. Fractures common in high-energy trauma.',
        'Patella': 'Sesamoid bone in quadriceps tendon protecting anterior knee. Patellar reflex tests L3-L4.',
        'ACL': 'Anterior cruciate ligament preventing anterior tibial translation. Most commonly injured knee ligament.',
        'PCL': 'Posterior cruciate ligament preventing posterior tibial displacement. Injured in dashboard injuries.',
        'Meniscus': 'C-shaped fibrocartilage pads cushioning femur-tibia contact. Tears cause locking and swelling.',
        'MCL': 'Medial collateral ligament resisting valgus stress. Often injured with ACL (unhappy triad).',
        'LCL': 'Lateral collateral ligament resisting varus stress. Less commonly injured than MCL.'
    },
    shoulder_joint: {
        'Humeral Head': 'Large spherical head of humerus articulating with shallow glenoid. High mobility at cost of stability.',
        'Glenoid Fossa': 'Shallow concavity on scapula receiving humeral head. Requires labrum and muscles for stability.',
        'Rotator Cuff': 'Four muscles (SITS) stabilizing the glenohumeral joint. Common injury in overhead activities.',
        'Acromion': 'Lateral extension of scapular spine forming shoulder point. Impingement syndrome occurs here.',
        'Clavicle': 'S-shaped bone connecting sternum to scapula. Most commonly fractured bone.',
        'Labrum': 'Fibrocartilaginous ring deepening the glenoid cavity. SLAP and Bankart tears cause instability.',
        'Biceps Tendon': 'Long head passes through bicipital groove. Tendinitis causes anterior shoulder pain.',
        'Deltoid': 'Triangular muscle covering shoulder. Common site for intramuscular injection.'
    },
    hand: {
        'Carpals': 'Eight small bones in two rows forming the wrist. Allow complex wrist movements.',
        'Metacarpals': 'Five bones forming the palm. Boxer\'s fracture of 5th metacarpal is common.',
        'Proximal Phalanx': 'First phalanx after metacarpal. Forms MCP joint; assessed for rheumatoid arthritis.',
        'Middle Phalanx': 'Second phalanx present in fingers 2-5. Not present in thumb.',
        'Distal Phalanx': 'Terminal phalanx bearing the nail bed. Tuft fractures common.',
        'Scaphoid': 'Most commonly fractured carpal bone. Risk of avascular necrosis.',
        'Lunate': 'Crescent-shaped carpal bone. Dislocation can compress median nerve.',
        'Thumb': 'Has only 2 phalanges. Opposable thumb enables grip; critical for hand function.'
    },
    foot: {
        'Calcaneus': 'Largest tarsal bone forming the heel. Calcaneal fractures from falls.',
        'Talus': 'Sits atop calcaneus, articulating with tibia/fibula. Key in ankle joint mechanics.',
        'Navicular': 'Boat-shaped bone on medial foot. Stress fractures common in athletes.',
        'Cuboid': 'Lateral tarsal bone supporting 4th and 5th metatarsals.',
        'Metatarsals': 'Five long bones of midfoot. March fractures from prolonged walking.',
        'Phalanges': 'Fourteen bones forming toes. Hammer toe and bunion deformities.',
        'Medial Arch': 'Longitudinal arch maintained by plantar fascia. Flat feet cause pain.',
        'Cuneiforms': 'Three wedge-shaped bones supporting the medial longitudinal arch.'
    },
    pelvis: {
        'Ilium': 'Largest pelvic bone with iliac crest. Landmark for bone marrow biopsy.',
        'Ischium': 'Inferior posterior pelvic bone. Bears weight when sitting.',
        'Pubis': 'Anterior inferior pelvic bone. Pubic ramus fractures in elderly.',
        'Sacrum': 'Triangular bone of 5 fused vertebrae. Contains sacral foramina.',
        'Coccyx': 'Small triangular bone below sacrum. Coccydynia from falls.',
        'Acetabulum': 'Hip socket formed by ilium, ischium, and pubis.',
        'Pubic Symphysis': 'Cartilaginous joint uniting left and right pubic bones. Widens in pregnancy.',
        'Pelvic Inlet': 'Upper pelvic opening. Obstetric conjugate determines birth canal adequacy.'
    },
    muscular_system: {
        'Pectoralis': 'Large fan-shaped chest muscle for arm adduction and internal rotation.',
        'Biceps': 'Two-headed arm flexor. Biceps reflex tests C5-C6 nerve roots.',
        'Quadriceps': 'Strongest muscle group. Vastus lateralis used for IM injection in infants.',
        'Deltoid': 'Triangular shoulder muscle. Primary IM injection site in adults.',
        'Trapezius': 'Large diamond-shaped back muscle. Assessed for CN XI function.',
        'Abdominals': 'Rectus abdominis and obliques. Assessed for guarding and rigidity.',
        'Gastrocnemius': 'Calf muscle. Achilles reflex tests S1-S2. DVT causes calf tenderness.',
        'Latissimus Dorsi': 'Broadest back muscle for arm extension. Used in reconstructive surgery.'
    },
    esophagus: {
        'Esophagus': 'Muscular tube (~25 cm) connecting pharynx to stomach. Peristalsis moves food; key for NG tube placement.',
        'Stomach': 'J-shaped organ for mechanical and chemical digestion. Produces HCl and pepsin; ulcer risk site.',
        'Liver': 'Largest solid organ. Metabolizes drugs, produces bile, and detoxifies blood. Assessed for hepatomegaly.',
        'Small Intestine': 'Six-meter tube (duodenum, jejunum, ileum) for nutrient absorption. Key for enteral feeding.',
        'Large Intestine': 'Absorbs water and electrolytes, forms feces. Important for ostomy care and colitis assessment.',
        'Gallbladder': 'Stores and concentrates bile. Murphy\'s sign positive in cholecystitis.'
    },
    small_intestine: {
        'Duodenum': 'C-shaped first segment receiving bile and pancreatic juice. Ulcer risk.',
        'Jejunum': 'Middle section with prominent folds. Primary nutrient absorption site.',
        'Ileum': 'Terminal section with Peyer\'s patches. B12 absorption; Crohn\'s disease site.',
        'Villi': 'Finger-like projections increasing surface area 600-fold.',
        'Plicae Circulares': 'Permanent circular folds slowing chyme passage.',
        'Mesentery': 'Peritoneal fold anchoring intestine with blood vessels.',
        'Ileocecal Valve': 'Sphincter preventing backflow of colonic contents.',
        'Brunner\'s Glands': 'Duodenal glands secreting alkaline mucus.'
    },
    large_intestine: {
        'Cecum': 'Blind-ended pouch at small-large intestine junction.',
        'Ascending Colon': 'Right side to hepatic flexure. Cancer presents with anemia.',
        'Transverse Colon': 'Crosses abdomen. Most mobile segment.',
        'Descending Colon': 'Left side. Diverticulosis most common here.',
        'Sigmoid Colon': 'S-shaped segment. Volvulus most common here.',
        'Rectum': 'Terminal 12cm. Rectal exam for prostate and fecal impaction.',
        'Appendix': 'Vestigial tube. Appendicitis: McBurney\'s point tenderness.',
        'Anal Canal': 'Terminal 4cm with sphincters. Hemorrhoids and fissures.'
    },
    pancreas: {
        'Head': 'In C-curve of duodenum. Most pancreatic cancers arise here.',
        'Body': 'Central portion. Pancreatitis pain radiates to back.',
        'Tail': 'Extends to splenic hilum. Highest islet concentration.',
        'Pancreatic Duct': 'Main duct carrying enzymes. Obstruction causes pancreatitis.',
        'Islets of Langerhans': 'Endocrine clusters: insulin (beta), glucagon (alpha).',
        'Uncinate Process': 'Hook behind mesenteric vessels. Complicates resection.',
        'Common Bile Duct': 'Through pancreatic head. Stone impaction causes pancreatitis.',
        'Ampulla of Vater': 'Junction entering duodenum. Cancer causes painless jaundice.'
    },
    tongue: {
        'Dorsum': 'Upper surface with papillae. Inspect for coating and lesions.',
        'Ventral Surface': 'Underside with veins. Sublingual medication absorption site.',
        'Taste Buds': 'Chemoreceptors for five tastes. Loss in CN VII/IX lesions.',
        'Frenulum': 'Midline fold. Ankyloglossia (tongue-tie) restricts movement.',
        'Intrinsic Muscles': 'Four muscles altering tongue shape for speech.',
        'Extrinsic Muscles': 'Four muscles connecting to skull. Protrusion tests CN XII.',
        'Lingual Tonsil': 'Lymphoid tissue at base. Part of Waldeyer\'s ring.',
        'Papillae': 'Filiform, fungiform, circumvallate projections. Atrophy in B12 deficiency.'
    },
    larynx: {
        'Epiglottis': 'Deflects food from airway. Visualized during laryngoscopy.',
        'Thyroid Cartilage': 'Largest cartilage (Adam\'s apple). Palpation landmark.',
        'Cricoid Cartilage': 'Complete ring. Sellick\'s maneuver landmark.',
        'Vocal Cords': 'Produce sound. Paralysis causes hoarseness.',
        'Tracheal Rings': 'C-shaped rings. Tracheostomy between 2nd-4th.',
        'Arytenoid Cartilage': 'Control vocal cord tension and position.',
        'Glottis': 'Opening between vocal cords. Narrowest adult airway point.',
        'Cricothyroid Membrane': 'Site for emergency cricothyrotomy.'
    },
    diaphragm: {
        'Central Tendon': 'Tendinous center. Right side higher due to liver.',
        'Right Crus': 'From L1-L3. Forms right border of aortic hiatus.',
        'Left Crus': 'From L1-L2. Forms left border of esophageal hiatus.',
        'Aortic Hiatus': 'T12 level. Transmits aorta and thoracic duct.',
        'Esophageal Hiatus': 'T10 level. Hiatal hernia occurs here.',
        'Caval Opening': 'T8 in central tendon for IVC.',
        'Costal Part': 'Largest part from lower ribs. Primary respiratory area.',
        'Sternal Part': 'Smallest part. Morgagni hernias can occur.'
    },
    bladder: {
        'Detrusor Muscle': 'Smooth muscle wall. Overactivity causes urge incontinence.',
        'Trigone': 'Triangular area. Most common site of bladder cancer.',
        'Ureteral Orifice': 'Where ureters enter. Flap-valve prevents reflux.',
        'Internal Sphincter': 'Involuntary smooth muscle at bladder neck.',
        'External Sphincter': 'Voluntary skeletal muscle. Damage causes incontinence.',
        'Dome': 'Superior surface. Distended bladder palpable above pubis.',
        'Neck': 'Inferior region to urethra. Obstruction in BPH.',
        'Mucosa': 'Transitional epithelium that stretches with filling.'
    },
    urinary_system: {
        'Renal Cortex': 'Outer layer with glomeruli. Blood filtration site.',
        'Renal Medulla': 'Inner region with pyramids. Urine concentration.',
        'Renal Pelvis': 'Collecting area. Hydronephrosis from obstruction.',
        'Ureter': 'Muscular tube (25-30cm). Three stone impaction sites.',
        'Bladder': 'Stores urine (400-600mL). Catheterize for retention.',
        'Urethra': '20cm male, 4cm female. UTIs more common in females.',
        'Renal Artery': '20-25% cardiac output per kidney. Stenosis causes hypertension.',
        'Adrenal Gland': 'Atop each kidney. Produces cortisol and catecholamines.'
    },
    adrenal_gland: {
        'Zona Glomerulosa': 'Outermost zone producing aldosterone. Regulates Na+/K+.',
        'Zona Fasciculata': 'Middle zone producing cortisol. Largest zone.',
        'Zona Reticularis': 'Innermost zone producing androgens (DHEA).',
        'Medulla': 'Central portion. Pheochromocytoma causes hypertensive crises.',
        'Cortex': 'Outer three zones. Addison\'s disease from insufficiency.',
        'Capsule': 'Fibrous outer covering protecting the gland.',
        'Adrenal Vein': 'Right to IVC, left to renal vein. Surgical asymmetry.',
        'Chromaffin Cells': 'Modified neurons releasing catecholamines.'
    },
    male_reproductive: {
        'Testis': 'Produces sperm and testosterone. Self-exam for cancer. Torsion is emergency.',
        'Epididymis': 'Sperm maturation and storage. Epididymitis causes scrotal pain.',
        'Vas Deferens': 'Sperm transport tube. Cut during vasectomy.',
        'Seminal Vesicle': 'Produces 60-70% of ejaculate volume.',
        'Prostate': 'Surrounds urethra. BPH causes obstruction; PSA for cancer screening.',
        'Urethra': 'Three sections. Catheter sizing important.',
        'Penis': 'Erectile tissue. Erection via parasympathetic vasodilation.',
        'Scrotum': 'External sac. Thermoregulation for spermatogenesis.'
    },
    female_reproductive: {
        'Ovary': 'Produces ova and hormones. Ovarian cysts and tumors.',
        'Fallopian Tube': 'Connects ovary to uterus. Ectopic pregnancy most common here.',
        'Uterus': 'Pear-shaped organ for fetal development. Fundal height assessment.',
        'Cervix': 'Lower portion. Pap smear screening; dilation in labor.',
        'Vagina': 'Birth canal. Vaginal examination for labor assessment.',
        'Endometrium': 'Inner lining shed during menstruation. Implantation site.',
        'Myometrium': 'Muscle layer. Contractions in labor; oxytocin stimulates.',
        'Broad Ligament': 'Peritoneal fold supporting uterus. Contains uterine artery.'
    },
    spinal_cord: {
        'Gray Matter': 'Butterfly-shaped center with neuron cell bodies. LMN signs when damaged.',
        'White Matter': 'Outer myelinated tracts. Ascending sensory, descending motor.',
        'Dorsal Horn': 'Posterior gray matter receiving sensory input. Pain processing.',
        'Ventral Horn': 'Anterior gray matter with motor neurons.',
        'Dorsal Root': 'Sensory fibers entering cord. Ganglia contain cell bodies.',
        'Ventral Root': 'Motor fibers leaving cord. Lesions cause LMN weakness.',
        'Meninges': 'Dura, arachnoid, pia mater. Epidural for anesthesia.',
        'Central Canal': 'CSF channel. Syringomyelia from pathological dilation.'
    },
    inner_ear: {
        'Cochlea': 'Snail-shaped. Organ of Corti for hearing. Tonotopic.',
        'Vestibule': 'Contains utricle and saccule. Detects linear acceleration.',
        'Semicircular Canals': 'Three loops detecting rotation. BPPV from displaced otoconia.',
        'Oval Window': 'Receives stapes vibrations. Otosclerosis fixes stapes here.',
        'Round Window': 'Pressure relief for cochlear fluid.',
        'Organ of Corti': 'Hair cells transduce sound to neural signals.',
        'Auditory Nerve': 'CN VIII. Acoustic neuroma compresses it.',
        'Endolymph': 'K+-rich fluid. Hydrops causes Meniere\'s disease.'
    },
    thyroid: {
        'Right Lobe': 'Lateral lobe over trachea. Palpated for nodules.',
        'Left Lobe': 'Moves with swallowing. Distinguishes from other neck masses.',
        'Isthmus': 'Bridge connecting lobes. Divided during thyroidectomy.',
        'Pyramidal Lobe': 'Vestigial lobe. Present in ~50% of people.',
        'Follicular Cells': 'Produce T3 and T4. Regulated by TSH.',
        'C-Cells': 'Produce calcitonin. Medullary thyroid cancer arises here.',
        'Parathyroid': 'Four glands producing PTH. Protect during surgery.',
        'Blood Vessels': 'Superior and inferior thyroid arteries. Ligate during surgery.'
    },
    pituitary: {
        'Hypothalamus & Pituitary': 'Master endocrine complex controlling growth, metabolism, reproduction, and stress response.',
        'Optic Chiasm': 'Above pituitary. Tumor compression causes bitemporal hemianopia.',
        'Thalamus': 'Sensory relay center connected to hypothalamus.',
        'Mammillary Bodies': 'Hypothalamic structures for memory. Damaged in Wernicke-Korsakoff syndrome.',
        'Hippocampus': 'Memory formation. Connected to hypothalamus via fornix.',
        'Amygdala': 'Emotional processing. Activates HPA axis stress response.',
        'Pineal Gland': 'Produces melatonin. Regulates circadian rhythm.',
        'Brain Stem': 'Controls vital functions. Connected to hypothalamic autonomic centers.'
    },
    lymph_node: {
        'Cortex': 'Outer B-cell follicles. Antibody production; enlarges in infection.',
        'Paracortex': 'T-cell rich region. Antigen presentation; depleted in HIV.',
        'Medulla': 'Inner cords and sinuses. Plasma cells and macrophages.',
        'Germinal Center': 'B-cell proliferation centers. Enlarged in lymphadenopathy.',
        'Afferent Vessel': 'Brings lymph into node from various points.',
        'Efferent Vessel': 'Exits at hilum with filtered lymph.',
        'Hilum': 'Indented region for vessel entry/exit.',
        'Capsule': 'Fibrous covering with trabeculae. Breached in metastatic cancer.'
    },
    ear: {
        'Pinna (Auricle)': 'External cartilage collecting sound. Landmarks: helix, tragus, lobule.',
        'Ear Canal': 'S-shaped tube to tympanic membrane. Cerumen impaction.',
        'Tympanic Membrane': 'Vibrates with sound. Bulging/red in otitis media.',
        'Malleus': 'Hammer ossicle on tympanic membrane. Handle visible on otoscopy.',
        'Incus': 'Anvil ossicle. Most commonly eroded in chronic otitis.',
        'Stapes': 'Smallest bone. Fixed in otosclerosis causing hearing loss.',
        'Eustachian Tube': 'Equalizes middle ear pressure. Dysfunction causes serous otitis.',
        'Mastoid Process': 'Temporal bone air cells. Mastoiditis from untreated otitis.'
    },
    blood_cells: {
        'Red Blood Cell': 'Biconcave disc carrying O2. Low count = anemia. 120-day lifespan.',
        'Neutrophil': 'Most abundant WBC (60-70%). First responder to bacterial infection.',
        'Lymphocyte': 'T-cells and B-cells. Low in HIV/AIDS.',
        'Monocyte': 'Largest WBC. Becomes macrophage in tissues.',
        'Eosinophil': 'Elevated in parasites and allergies.',
        'Basophil': 'Rarest WBC. Releases histamine and heparin.',
        'Platelet': 'For hemostasis. Low = thrombocytopenia bleeding risk.',
        'Plasma': 'Liquid 55% of blood. Contains proteins and electrolytes.'
    },
    human_cell: {
        'Nucleus': 'Contains DNA. Controls cell activities. Cancer involves mutations.',
        'Mitochondria': 'Produces ATP. Cyanide inhibits electron transport chain.',
        'Endoplasmic Reticulum': 'Protein and lipid synthesis. Drug metabolism in smooth ER.',
        'Golgi Apparatus': 'Processes and packages proteins for secretion.',
        'Cell Membrane': 'Phospholipid bilayer. Receptor sites for drugs and hormones.',
        'Ribosome': 'Protein synthesis from mRNA. Free and membrane-bound.',
        'Lysosome': 'Digestive enzymes. Autophagy; lysosomal storage diseases.',
        'Cytoplasm': 'Gel filling cell. Contains cytoskeleton. Site of glycolysis.'
    },
    dna: {
        'Double Helix': 'Two antiparallel chains wound together. B-form most common.',
        'Base Pairs': 'A-T (2 H-bonds) and G-C (3 H-bonds). Enable replication.',
        'Sugar-Phosphate Backbone': 'Structural backbone of alternating sugars and phosphates.',
        'Adenine': 'Purine pairing with thymine. Replaced by uracil in RNA.',
        'Thymine': 'Pyrimidine unique to DNA. UV dimers cause skin cancer.',
        'Guanine': 'Purine pairing with cytosine. Three hydrogen bonds.',
        'Cytosine': 'Pyrimidine. Methylation regulates gene expression.',
        'Hydrogen Bonds': 'Weak bonds allowing strand separation for replication.'
    },
    iv_setup: {
        'IV Bag': 'Holds solution (NS, D5W, LR). Check clarity and expiry.',
        'Drip Chamber': 'For counting drops/min. Macro or micro drip sets.',
        'Roller Clamp': 'Controls flow by compressing tubing.',
        'Tubing': 'PVC connecting bag to patient. Prime to remove air.',
        'Y-Port': 'Injection port for secondary medications.',
        'Cannula': 'IV catheter (18-24G). 18G for blood, 22G for infusions.',
        'Flow Regulator': 'Precise flow control. Pumps more accurate for critical meds.',
        'Spike': 'Pierces IV bag port. Maintain sterility.'
    },
    catheter: {
        'Catheter Tip': 'Rounded for smooth insertion. Coude tip for prostatic navigation.',
        'Retention Balloon': 'Inflated with sterile water (never saline) to secure in bladder.',
        'Drainage Lumen': 'Main urine channel. Three-way adds irrigation lumen.',
        'Inflation Lumen': 'Connected to balloon port. Use syringe for designated volume.',
        'Drainage Port': 'Connects to collection bag. Maintain closed system for CAUTI prevention.',
        'Balloon Port': 'For inflate/deflate. Color-coded with volume label.',
        'Shaft': 'Silicone or latex body. 14-16Fr typical adult. Latex allergy check.',
        'Collection Bag': 'Keep below bladder. Empty when 2/3 full. Measure I&O.'
    },
    neuron: {
        'Cell Body (Soma)': 'Contains the nucleus and organelles. Integrates incoming signals from dendrites and initiates action potentials.',
        'Dendrites': 'Branch-like extensions receiving signals from other neurons. Increase surface area for synaptic input.',
        'Axon': 'Long projection conducting electrical impulses away from the cell body. Can extend up to 1 metre in motor neurons.',
        'Myelin Sheath': 'Insulating lipid layer formed by Schwann cells (PNS) or oligodendrocytes (CNS). Enables saltatory conduction; damaged in MS.',
        'Nodes of Ranvier': 'Gaps between myelin segments where ion channels concentrate. Enable rapid saltatory conduction of action potentials.',
        'Axon Terminal': 'Synaptic boutons releasing neurotransmitters into the synaptic cleft. Target for many neurological medications.',
        'Synapse': 'Junction between two neurons. Neurotransmitters cross the cleft to bind postsynaptic receptors.',
        'Axon Hillock': 'Transition zone from soma to axon. Trigger zone where action potentials are initiated when threshold is reached.'
    },
    gallbladder_organ: {
        'Fundus': 'Rounded end projecting beyond liver edge. Murphy\'s sign elicited here.',
        'Body': 'Main portion contacting liver surface. Stores and concentrates bile.',
        'Neck': 'Tapered portion. Hartmann\'s pouch common stone impaction site.',
        'Cystic Duct': 'Connects to common hepatic duct. Stone impaction causes biliary colic.',
        'Mucosa': 'Columnar epithelium concentrating bile 5-10 fold.',
        'Serosa': 'Peritoneal covering. Important in gallbladder cancer spread.',
        'Hepatic Surface': 'Adheres to liver fossa. Inflammation spreads to liver.',
        'Cystic Artery': 'In Calot\'s triangle. Must identify during cholecystectomy.'
    }
};

// Mapping from old 41-part keys to 8 clinically relevant grouped structures
const HEART_PART_TO_GROUP = {
    '0': 'right_atrium', '1': 'right_atrium', '17': 'right_atrium',
    '12': 'left_atrium', '13': 'left_atrium', '29': 'left_atrium', '31': 'left_atrium',
    '2': 'right_ventricle', '11': 'right_ventricle', '16': 'right_ventricle',
    '21': 'right_ventricle', '23': 'right_ventricle', '25': 'right_ventricle', '35': 'right_ventricle',
    '7': 'left_ventricle', '8': 'left_ventricle', '9': 'left_ventricle', '14': 'left_ventricle',
    '18': 'left_ventricle', '20': 'left_ventricle', '32': 'left_ventricle', '33': 'left_ventricle',
    '36': 'left_ventricle', '37': 'left_ventricle', '38': 'left_ventricle', '39': 'left_ventricle', '40': 'left_ventricle',
    '4': 'aorta', '6': 'aorta', '26': 'aorta',
    '10': 'pulmonary_artery', '28': 'pulmonary_artery',
    '3': 'superior_vena_cava', '27': 'superior_vena_cava',
    '5': 'coronary_vessels', '15': 'coronary_vessels', '19': 'coronary_vessels', '24': 'coronary_vessels', '34': 'coronary_vessels'
    // '22' and '30' are numbered callout markers — excluded (hidden by markHeartNumberLabelMeshes)
};

// Hannah Newey Sketchfab heart — 8 clinically relevant structure groups
const HEART_MESH_DETAILS = {
    'right_atrium': { title: 'Right Atrium', legendLabel: 'Right atrium', detail: 'Thin-walled upper right chamber receiving deoxygenated blood from the body via the superior and inferior vena cava. Clinically relevant for central venous access, atrial arrhythmias (atrial fibrillation/flutter), and right heart volume status assessment.' },
    'left_atrium': { title: 'Left Atrium', legendLabel: 'Left atrium', detail: 'Upper left chamber receiving oxygenated blood from the lungs via four pulmonary veins. Enlargement correlates with mitral valve disease and atrial fibrillation risk. Assessed via echocardiography for left heart function.' },
    'right_ventricle': { title: 'Right Ventricle', legendLabel: 'Right ventricle', detail: 'Lower right chamber pumping deoxygenated blood to the lungs via the pulmonary artery. Thin-walled compared to the LV. Dilates in right heart failure, pulmonary embolism, and cor pulmonale. Important for RV strain assessment.' },
    'left_ventricle': { title: 'Left Ventricle', legendLabel: 'Left ventricle', detail: 'The heart\'s main pumping chamber — the thickest, most muscular wall. Pumps oxygenated blood to the entire body via the aorta. Dysfunction drives heart failure. Wall thickness and motion are key in echocardiography, ischemia assessment, and cardiomyopathy.' },
    'aorta': { title: 'Aorta', legendLabel: 'Aorta', detail: 'The largest artery in the body, arising from the left ventricle. The ascending aorta, aortic arch, and descending aorta distribute oxygenated blood systemically. Relevant to aortic stenosis/regurgitation, aneurysm, dissection, and blood pressure physiology.' },
    'pulmonary_artery': { title: 'Pulmonary Artery', legendLabel: 'Pulmonary artery', detail: 'The only artery carrying deoxygenated blood — from the right ventricle to both lungs for gas exchange. Key in pulmonary hypertension, pulmonary embolism, and cyanotic heart disease assessment.' },
    'superior_vena_cava': { title: 'Superior Vena Cava', legendLabel: 'Superior vena cava', detail: 'Large vein returning deoxygenated blood from the upper body to the right atrium. Landmark for central line placement (internal jugular, subclavian). SVC syndrome (compression/obstruction) is an oncological emergency.' },
    'coronary_vessels': { title: 'Coronary Vessels', legendLabel: 'Coronary vessels', detail: 'The coronary arteries (LAD, circumflex, RCA) and veins running along the heart surface in the interventricular and atrioventricular grooves. Supply the myocardium with oxygenated blood. Occlusion causes myocardial infarction (STEMI/NSTEMI). Target for CABG and PCI.' }
};
/**
 * Leiden–Delft–Groningen “Healthy heart and lungs” (E-learning UMCG on Sketchfab).
 * Seven submeshes in scene order: normaal25 → three normaal6 → normaal5 → normaal4 → linkerlong3.
 * Text follows the circulation narrative on the Sketchfab page; mesh↔number pairing is inferred from
 * geometry names (linkerlong = linker long = left lung). Verify against the 3D viewer if needed.
 * @see https://sketchfab.com/3d-models/healthy-heart-and-lungs-5c62cd4d4ba04243be1062d2263d3ef0
 */
const UMCG_HEART_LUNG_CALLOUTS = {
    umcg_hl_1: {
        title: 'Right lung',
        legendLabel: 'Right lung',
        detail: 'Pulmonary gas exchange: deoxygenated blood from the pulmonary arteries releases CO2 and binds O2 across the alveolar–capillary membrane. Pairs with the left lung for V/Q matching, consolidation patterns, and PE teaching. (Mesh block normaal25 in the glTF.)'
    },
    umcg_hl_2: {
        title: 'Right atrium & venae cavae',
        legendLabel: 'Right atrium / caval veins',
        detail: 'Systemic venous return enters the right atrium via the superior and inferior vena cava—exactly as described on the UMCG Sketchfab model page. Central line teaching, atrial pressure, and arrhythmia substrates start here.'
    },
    umcg_hl_3: {
        title: 'Right ventricle',
        legendLabel: 'Right ventricle',
        detail: 'Blood passes the tricuspid valve into the right ventricle, then is pumped into the pulmonary artery toward the lungs. Core to right heart failure, pulmonary hypertension, and acute PE physiology.'
    },
    umcg_hl_4: {
        title: 'Pulmonary trunk & pulmonary arteries',
        legendLabel: 'Pulmonary arteries',
        detail: 'The only arteries carrying deoxygenated blood: RV outflow splits toward both lungs for oxygenation. Emboli, shunts, and PA pressure targets in critical care map to this circulation.'
    },
    umcg_hl_5: {
        title: 'Left ventricle',
        legendLabel: 'Left ventricle',
        detail: 'After the mitral valve, the left ventricle generates systemic pressure, ejecting into the aorta to perfuse organs. The aortic root may be continuous with this mesh on the export—correlate with echo “LV outflow” and afterload concepts.'
    },
    umcg_hl_6: {
        title: 'Left atrium & pulmonary veins',
        legendLabel: 'Left atrium / pulmonary veins',
        detail: 'Oxygen-rich blood from the lungs reaches the left atrium via pulmonary veins, then crosses the mitral valve. AF substrate, mitral disease, and LA pressure all tie to this chamber.'
    },
    umcg_hl_7: {
        title: 'Left lung',
        legendLabel: 'Left lung (linker long)',
        detail: 'Named linkerlong in the source file (Dutch: linker long). Same alveolar physiology as the right lung; auscultation, pneumothorax, and pleural procedures are taught with bilateral comparison.'
    }
};

const KIDNEY_GLTF_MESH_TO_KEY = {
    Object_5: 'concept_whole',
    Object_0: 'concept_whole'
};

const KIDNEY_MESH_DETAILS = {
    kid_ann_1: {
        title: '1 — Superior pole (upper extremity)',
        legendLabel: 'Superior pole',
        detail: 'Upper rounded end of the bean-shaped kidney. Useful landmark when describing organ lie and imaging orientation (e.g. upper pole masses).'
    },
    kid_ann_2: {
        title: '2 — Inferior pole (lower extremity)',
        legendLabel: 'Inferior pole',
        detail: 'Lower rounded end. Pairs with the superior pole to describe longitudinal axis and pole-to-pole pathology (e.g. stones, scars).'
    },
    kid_ann_3: {
        title: '3 — Convex lateral border',
        legendLabel: 'Lateral convex border',
        detail: 'Smooth outer curve facing the body wall—typical surface contour on a whole-organ model. Contrast with the medial hilum where vessels and ureter converge.'
    },
    kid_ann_4: {
        title: '4 — Hilum (medial concavity)',
        legendLabel: 'Hilum region',
        detail: 'Indented medial aspect where renal artery and vein and ureter relate in vivo. This concept mesh suggests that notch; pair with cross-section diagrams for vessel order.'
    },
    kid_ann_5: {
        title: '5 — Capsule / external surface',
        legendLabel: 'Outer surface',
        detail: 'Fibrous capsule closely invests the kidney; pain-sensitive when stretched (e.g. acute obstruction, capsular hematoma). On this model, a representative convex surface callout.'
    },
    concept_whole: {
        title: 'Kidney — 3D Ginjal concept',
        legendLabel: 'Kidney (concept model)',
        detail: 'Single-surface educational model (“ginjal” = kidney) showing overall external form and hilum region for orientation. Pair with texts or layered models for cortex vs medulla, vessels, and collecting system. Source: siskahidayati on Sketchfab (CC BY 4.0). Sketchfab’s own hotspot annotations are not included in downloaded glTF—numbers 1–5 here are added in this viewer for teaching.'
    }
};

const SYRINGE_MESH_DETAILS = {
    barrel: {
        title: 'Barrel',
        legendLabel: 'Barrel',
        detail: 'Clear chamber holding fluid; graduations guide dose. Inspect for cracks, clouding, and correct total volume before draw-up or injection.'
    },
    flange: {
        title: 'Flange (top rim)',
        legendLabel: 'Flange',
        detail: 'Rim at the barrel opening; stabilizes two-handed technique and prevents finger slip onto the plunger during aspiration.'
    },
    grips: {
        title: 'Finger grips (wings)',
        legendLabel: 'Finger grips',
        detail: 'Lateral wings for index–middle finger brace while the thumb operates the plunger—core to controlled IM/SQ technique.'
    },
    graduations: {
        title: 'Graduation marks & numerals',
        legendLabel: 'Graduations',
        detail: 'Volume scale on the barrel; read at the leading edge of the plunger rubber at eye level to avoid parallax error—critical for medication safety.'
    },
    plunger: {
        title: 'Plunger (rod, seal & thumb rest)',
        legendLabel: 'Plunger',
        detail: 'Rod, rubber seal, and thumb disc work together to create negative pressure (aspirate) or positive pressure (inject). Seal integrity prevents leaks and inaccurate volumes.'
    },
    luer: {
        title: 'Luer / tip connector',
        legendLabel: 'Luer tip',
        detail: 'Tapered connector where needle or cap attaches; verify secure twist-lock engagement before injection to prevent disconnect.'
    },
    needle_hub: {
        title: 'Needle hub & color ring',
        legendLabel: 'Needle hub',
        detail: 'Colored hub often encodes gauge in manufacturer schemes; also the grasp point for safe attachment and sharps disposal.'
    },
    needle_shaft: {
        title: 'Needle shaft',
        legendLabel: 'Needle shaft',
        detail: 'Cannula length and gauge affect flow rate, pain, and tissue depth—longer needles for deep IM, finer for subcutaneous insulin.'
    },
    bevel: {
        title: 'Bevel (tip)',
        legendLabel: 'Bevel',
        detail: 'Sloped cutting surface; bevel-up skin entry reduces tissue coring and improves patient comfort for many injections.'
    },
    medication: {
        title: 'Medication column (fluid)',
        legendLabel: 'Fluid column',
        detail: 'Represents drug solution in the barrel; teach checking for precipitates, color change, and air bubbles before administration.'
    },
    bubbles: {
        title: 'Air bubbles',
        legendLabel: 'Air bubbles',
        detail: 'Trapped gas can alter measured volume and, if injected intravascularly in quantity, risk embolism—tap/flick and expel to syringe dead space when protocol requires.'
    }
};

const LIVER_MESH_DETAILS = {
    right_lobe: { title: 'Right Lobe', legendLabel: 'Right lobe', detail: 'Largest lobe occupying ~60% of liver mass. Primary site of cytochrome P450 drug metabolism. Palpable below right costal margin; enlargement suggests hepatomegaly.' },
    left_lobe: { title: 'Left Lobe', legendLabel: 'Left lobe', detail: 'Flatter lobe extending across the midline to the left upper quadrant. Separated from right lobe by the falciform ligament.' },
    caudate_lobe: { title: 'Caudate Lobe', legendLabel: 'Caudate lobe', detail: 'Posterior lobe with dual blood supply from both portal vein and hepatic artery. Often spared in Budd-Chiari syndrome and early cirrhosis.' },
    quadrate_lobe: { title: 'Quadrate Lobe', legendLabel: 'Quadrate lobe', detail: 'Small inferior lobe between gallbladder fossa and round ligament. Functionally part of the left hemiliver based on blood supply.' },
    gallbladder: { title: 'Gallbladder', legendLabel: 'Gallbladder', detail: 'Pear-shaped reservoir storing and concentrating bile. Murphy\'s sign on palpation helps diagnose cholecystitis. Gallstones may obstruct cystic or common bile duct.' },
    hepatic_artery: { title: 'Hepatic Artery', legendLabel: 'Hepatic artery', detail: 'Branch of celiac trunk supplying oxygenated blood (~25% of hepatic flow). Proper hepatic artery divides into left and right branches at the porta hepatis.' },
    portal_vein: { title: 'Portal Vein', legendLabel: 'Portal vein', detail: 'Carries nutrient-rich, partially deoxygenated blood from the GI tract (~75% of hepatic flow). Portal hypertension causes esophageal varices and ascites.' },
    bile_duct: { title: 'Common Bile Duct', legendLabel: 'Bile duct', detail: 'Formed by the junction of cystic and common hepatic ducts. Carries bile to the duodenum; obstruction causes conjugated hyperbilirubinemia and jaundice.' }
};

const STOMACH_MESH_DETAILS = {
    fundus: { title: 'Fundus', legendLabel: 'Fundus', detail: 'Upper dome above the cardiac notch. Collects swallowed air visible as gastric bubble on left lateral X-ray. Contains parietal and chief cells.' },
    cardia: { title: 'Cardia', legendLabel: 'Cardia', detail: 'Narrow zone at the gastroesophageal junction. The lower esophageal sphincter here prevents gastric acid reflux; incompetence causes GERD.' },
    body: { title: 'Body (Corpus)', legendLabel: 'Body', detail: 'Largest region of the stomach between fundus and antrum. Parietal cells secrete HCl and intrinsic factor; chief cells secrete pepsinogen for protein digestion.' },
    pylorus: { title: 'Pylorus', legendLabel: 'Pylorus', detail: 'Distal funnel-shaped region connecting to duodenum. Pyloric stenosis in infants presents with projectile vomiting; diagnosed by ultrasound "olive" sign.' },
    greater_curvature: { title: 'Greater Curvature', legendLabel: 'Greater curvature', detail: 'Long convex lateral border. Attachment of greater omentum ("policeman of the abdomen"). Supplied by right and left gastroepiploic arteries.' },
    lesser_curvature: { title: 'Lesser Curvature', legendLabel: 'Lesser curvature', detail: 'Short concave medial border. Most common site for peptic ulcers; supplied by left gastric artery. Attached to lesser omentum.' },
    rugae: { title: 'Rugae (mucosal folds)', legendLabel: 'Rugae', detail: 'Longitudinal folds of gastric mucosa allowing distension. Flatten when stomach fills to accommodate up to ~1.5L. Visible on endoscopy.' },
    sphincter: { title: 'Pyloric Sphincter', legendLabel: 'Pyloric sphincter', detail: 'Thick circular smooth muscle valve regulating gastric emptying. Coordinates with duodenal feedback to control chyme release rate.' }
};

const EYE_MESH_DETAILS = {
    sclera: { title: 'Sclera', legendLabel: 'Sclera', detail: 'Dense white connective tissue forming the "white of the eye." Maintains globe shape and provides muscle attachment. Yellowing (icterus) indicates jaundice.' },
    cornea: { title: 'Cornea', legendLabel: 'Cornea', detail: 'Transparent avascular dome providing ~70% of refractive power. Corneal reflex (blink when touched) tests CN V (afferent) and CN VII (efferent).' },
    iris: { title: 'Iris', legendLabel: 'Iris', detail: 'Pigmented muscular ring controlling pupil diameter. Dilator pupillae (sympathetic) and sphincter pupillae (parasympathetic) balance light entry.' },
    pupil: { title: 'Pupil', legendLabel: 'Pupil', detail: 'Central aperture in the iris. PERRLA assessment (Pupils Equal, Round, Reactive to Light and Accommodation) is essential in neurological examination.' },
    lens: { title: 'Lens', legendLabel: 'Lens', detail: 'Biconvex crystalline structure behind the iris for fine focusing (accommodation). Cataracts—lens opacification—are the leading cause of reversible blindness worldwide.' },
    retina: { title: 'Retina', legendLabel: 'Retina', detail: 'Multi-layered neural tissue lining the posterior eye. Contains rods (dim light) and cones (color). Diabetic retinopathy is a major complication requiring regular screening.' },
    optic_nerve: { title: 'Optic Nerve (CN II)', legendLabel: 'Optic nerve', detail: 'Carries ~1.2 million axons from retinal ganglion cells to the brain. Papilledema (disc swelling) on fundoscopy indicates raised intracranial pressure.' },
    vitreous: { title: 'Vitreous Body', legendLabel: 'Vitreous body', detail: 'Transparent gel filling the posterior chamber maintaining eye shape. New floaters and flashes suggest possible retinal detachment—a medical emergency.' }
};

const TOOTH_MESH_DETAILS = {
    enamel: { title: 'Enamel', legendLabel: 'Enamel', detail: 'Hardest tissue in the body (96% hydroxyapatite) covering the anatomical crown. Acid erosion from bacteria or diet causes dental caries; fluoride strengthens enamel.' },
    dentin: { title: 'Dentin', legendLabel: 'Dentin', detail: 'Yellowish calcified tissue forming the bulk of the tooth. Contains dentinal tubules transmitting thermal and pain stimuli. Exposed dentin causes sensitivity.' },
    pulp: { title: 'Pulp Chamber', legendLabel: 'Pulp chamber', detail: 'Central cavity containing dental pulp (nerves, vessels, connective tissue). Pulpitis from deep caries causes severe throbbing pain; may require root canal therapy.' },
    root_canal: { title: 'Root Canal', legendLabel: 'Root canal', detail: 'Narrow channel within each root carrying neurovascular supply. Root canal treatment removes infected pulp, shapes the canal, and seals it with gutta-percha.' },
    crown: { title: 'Crown', legendLabel: 'Crown', detail: 'Anatomical crown is the visible portion above the gum line covered by enamel. Shape varies: incisors (cutting), canines (tearing), premolars/molars (grinding).' },
    root: { title: 'Root', legendLabel: 'Root', detail: 'Portion embedded in alveolar bone anchoring the tooth. Molars have 2-3 roots; incisors have one. Periapical abscess at root tip causes swelling and pain.' },
    cementum: { title: 'Cementum', legendLabel: 'Cementum', detail: 'Thin minerite layer covering the root surface. Anchors the periodontal ligament fibers (Sharpey\'s fibers) that suspend the tooth in its socket.' },
    gingiva: { title: 'Gingiva (Gum)', legendLabel: 'Gingiva', detail: 'Mucosal tissue surrounding and protecting tooth necks. Gingivitis (red, swollen, bleeding gums) progresses to periodontitis with bone loss if untreated.' }
};

const SPINE_MESH_DETAILS = {
    vertebral_body: { title: 'Vertebral Body', legendLabel: 'Vertebral body', detail: 'Anterior weight-bearing cylinder of each vertebra. Compression fractures common in osteoporosis; loss of height and kyphosis are clinical signs.' },
    disc: { title: 'Intervertebral Disc', legendLabel: 'Disc', detail: 'Fibrocartilage pad with outer annulus fibrosus and inner nucleus pulposus. Herniation compresses nerve roots causing radiculopathy (pain, weakness, numbness).' },
    spinous_process: { title: 'Spinous Process', legendLabel: 'Spinous process', detail: 'Posterior midline projection palpable through skin. Key landmark: L3-L4 interspace (at iliac crest level) used for lumbar puncture.' },
    transverse_process: { title: 'Transverse Process', legendLabel: 'Transverse process', detail: 'Lateral projections for muscle and ligament attachment. In thoracic spine, articulate with ribs. Fractures suggest significant trauma force.' },
    spinal_canal: { title: 'Spinal Canal', legendLabel: 'Spinal canal', detail: 'Central passage formed by vertebral foramina housing the spinal cord and cauda equina. Stenosis causes neurogenic claudication and bowel/bladder dysfunction.' },
    pedicle: { title: 'Pedicle', legendLabel: 'Pedicle', detail: 'Short thick bridge connecting vertebral body to posterior arch. Entry point for pedicle screws in spinal fusion surgery; narrow in thoracic spine.' },
    lamina: { title: 'Lamina', legendLabel: 'Lamina', detail: 'Flat plate between spinous process and pedicle forming posterior canal wall. Laminectomy (surgical removal) decompresses the spinal cord in stenosis.' },
    facet_joint: { title: 'Facet Joint', legendLabel: 'Facet joint', detail: 'Paired synovial joints (zygapophyseal) guiding spinal motion. Orientation varies by region: sagittal in lumbar (flexion/extension), coronal in thoracic (rotation).' }
};

const SKIN_MESH_DETAILS = {
    epidermis: { title: 'Epidermis', legendLabel: 'Epidermis', detail: 'Outermost avascular layer. Keratinocytes migrate from stratum basale to stratum corneum in ~28 days. Provides waterproof barrier and UV protection.' },
    dermis: { title: 'Dermis', legendLabel: 'Dermis', detail: 'Collagen-rich structural layer with blood vessels, nerves, and appendages. Partial-thickness burns reach the dermis—painful, blistering, with intact sensation.' },
    hypodermis: { title: 'Hypodermis (Subcutis)', legendLabel: 'Hypodermis', detail: 'Subcutaneous fat layer for insulation, cushioning, and energy storage. Preferred site for subcutaneous injections (insulin, heparin, enoxaparin).' },
    hair_follicle: { title: 'Hair Follicle', legendLabel: 'Hair follicle', detail: 'Epidermal invagination producing the hair shaft. Growth cycles (anagen-catagen-telogen) vary by body site. Folliculitis is a common skin infection.' },
    sweat_gland: { title: 'Sweat Gland (Eccrine)', legendLabel: 'Sweat gland', detail: 'Coiled tubular glands throughout the skin for thermoregulation via evaporative cooling. Diaphoresis (excessive sweating) is a sign of cardiac distress or shock.' },
    sebaceous_gland: { title: 'Sebaceous Gland', legendLabel: 'Sebaceous gland', detail: 'Holocrine glands producing sebum to lubricate skin and hair. Overproduction and blocked pores lead to acne; cysts form from obstructed ducts.' },
    blood_vessel: { title: 'Blood Vessel', legendLabel: 'Blood vessel', detail: 'Dermal arterioles, capillaries, and venules regulate skin temperature and supply nutrients. Capillary refill time >2 seconds suggests poor peripheral perfusion.' },
    nerve_ending: { title: 'Nerve Ending', legendLabel: 'Nerve ending', detail: 'Sensory receptors including Meissner (light touch), Pacinian (pressure), free nerve endings (pain/temperature). Assess dermatome sensation in neurological exams.' }
};

const SKULL_MESH_DETAILS = {
    frontal_bone: { title: 'Frontal Bone', legendLabel: 'Frontal bone', detail: 'Forms the forehead and superior orbits. Contains frontal sinuses. Site of frontal lobe protection.' },
    parietal_bone: { title: 'Parietal Bone', legendLabel: 'Parietal bone', detail: 'Paired bones forming superior and lateral skull. Contains parietal eminence landmark for assessment.' },
    temporal_bone: { title: 'Temporal Bone', legendLabel: 'Temporal bone', detail: 'Houses the middle and inner ear structures. Contains mastoid process landmark for antibiotic injection.' },
    occipital_bone: { title: 'Occipital Bone', legendLabel: 'Occipital bone', detail: 'Forms posterior cranial fossa. Contains foramen magnum for spinal cord passage.' },
    sphenoid_bone: { title: 'Sphenoid Bone', legendLabel: 'Sphenoid bone', detail: 'Butterfly-shaped bone at skull base. Contains sella turcica housing the pituitary gland.' },
    mandible: { title: 'Mandible', legendLabel: 'Mandible', detail: 'Largest facial bone, forming the lower jaw. Only movable skull bone; assessed for TMJ disorders.' },
    maxilla: { title: 'Maxilla', legendLabel: 'Maxilla', detail: 'Forms the upper jaw and hard palate. Contains maxillary sinuses; important for dental assessment.' },
    zygomatic_bone: { title: 'Zygomatic Bone', legendLabel: 'Zygomatic bone', detail: 'Forms the cheekbone prominence. Important facial landmark for assessment of facial fractures.' }
};

const HIP_JOINT_MESH_DETAILS = {
    femoral_head: { title: 'Femoral Head', legendLabel: 'Femoral head', detail: 'Spherical head of femur articulating with acetabulum. Vulnerable to avascular necrosis due to tenuous blood supply.' },
    acetabulum: { title: 'Acetabulum', legendLabel: 'Acetabulum', detail: 'Cup-shaped socket of pelvis receiving the femoral head. Deepened by the labrum for stability.' },
    femoral_neck: { title: 'Femoral Neck', legendLabel: 'Femoral neck', detail: 'Narrow region connecting femoral head to shaft. Most common site of hip fractures in elderly.' },
    greater_trochanter: { title: 'Greater Trochanter', legendLabel: 'Greater trochanter', detail: 'Lateral bony prominence for gluteal muscle attachment. Landmark for intramuscular injection site.' },
    labrum: { title: 'Labrum', legendLabel: 'Labrum', detail: 'Fibrocartilage ring deepening the acetabulum. Tears cause clicking, pain, and instability.' },
    joint_capsule: { title: 'Joint Capsule', legendLabel: 'Joint capsule', detail: 'Fibrous capsule enclosing the joint. Contains synovial membrane producing lubricating fluid.' },
    ligament_teres: { title: 'Ligamentum Teres', legendLabel: 'Ligamentum teres', detail: 'Intra-articular ligament from acetabular fossa to femoral head. Carries artery to femoral head.' },
    ilium: { title: 'Ilium', legendLabel: 'Ilium', detail: 'Largest pelvic bone forming superior acetabulum. Iliac crest is palpable landmark for procedures.' }
};

const KNEE_JOINT_MESH_DETAILS = {
    femur_condyle: { title: 'Femoral Condyle', legendLabel: 'Femoral condyle', detail: 'Rounded distal femur surfaces articulating with tibia. Weight-bearing surface prone to cartilage wear.' },
    tibia_plateau: { title: 'Tibial Plateau', legendLabel: 'Tibial plateau', detail: 'Flat superior tibia surface receiving femoral condyles. Fractures common in high-energy trauma.' },
    patella: { title: 'Patella', legendLabel: 'Patella', detail: 'Sesamoid bone in quadriceps tendon protecting anterior knee. Patellar reflex tests L3-L4 nerve roots.' },
    acl: { title: 'ACL', legendLabel: 'ACL', detail: 'Anterior cruciate ligament preventing anterior tibial translation. Most commonly injured knee ligament in sports.' },
    pcl: { title: 'PCL', legendLabel: 'PCL', detail: 'Posterior cruciate ligament preventing posterior tibial displacement. Injured in dashboard injuries.' },
    meniscus: { title: 'Meniscus', legendLabel: 'Meniscus', detail: 'C-shaped fibrocartilage pads cushioning femur-tibia contact. Tears cause locking and swelling.' },
    mcl: { title: 'MCL', legendLabel: 'MCL', detail: 'Medial collateral ligament resisting valgus stress. Often injured with ACL and medial meniscus (unhappy triad).' },
    lcl: { title: 'LCL', legendLabel: 'LCL', detail: 'Lateral collateral ligament resisting varus stress. Less commonly injured than MCL.' }
};

const SHOULDER_JOINT_MESH_DETAILS = {
    humeral_head: { title: 'Humeral Head', legendLabel: 'Humeral head', detail: 'Large spherical head of humerus articulating with shallow glenoid. High mobility at cost of stability.' },
    glenoid: { title: 'Glenoid Fossa', legendLabel: 'Glenoid fossa', detail: 'Shallow concavity on scapula receiving humeral head. Small surface area requires labrum and muscles for stability.' },
    rotator_cuff: { title: 'Rotator Cuff', legendLabel: 'Rotator cuff', detail: 'Four muscles (supraspinatus, infraspinatus, teres minor, subscapularis) stabilizing the glenohumeral joint.' },
    acromion: { title: 'Acromion', legendLabel: 'Acromion', detail: 'Lateral extension of scapular spine forming shoulder point. Impingement syndrome occurs here.' },
    clavicle: { title: 'Clavicle', legendLabel: 'Clavicle', detail: 'S-shaped bone connecting sternum to scapula. Most commonly fractured bone; protects subclavian vessels.' },
    labrum_shoulder: { title: 'Labrum', legendLabel: 'Labrum', detail: 'Fibrocartilaginous ring deepening the glenoid cavity. SLAP and Bankart tears cause instability.' },
    biceps_tendon: { title: 'Biceps Tendon', legendLabel: 'Biceps tendon', detail: 'Long head passes through bicipital groove. Tendinitis causes anterior shoulder pain.' },
    deltoid: { title: 'Deltoid', legendLabel: 'Deltoid', detail: 'Triangular muscle covering shoulder. Common site for intramuscular injection (deltoid injection).' }
};

const HAND_MESH_DETAILS = {
    carpals: { title: 'Carpals', legendLabel: 'Carpals', detail: 'Eight small bones arranged in two rows forming the wrist. Allow complex wrist movements.' },
    metacarpals: { title: 'Metacarpals', legendLabel: 'Metacarpals', detail: 'Five bones forming the palm. Metacarpal fractures (boxer\'s fracture of 5th) are common.' },
    proximal_phalanx: { title: 'Proximal Phalanx', legendLabel: 'Proximal phalanx', detail: 'First phalanx after metacarpal. Forms MCP joint (knuckle); assessed for rheumatoid arthritis.' },
    middle_phalanx: { title: 'Middle Phalanx', legendLabel: 'Middle phalanx', detail: 'Second phalanx present in fingers 2-5. Not present in thumb. Forms PIP joint.' },
    distal_phalanx: { title: 'Distal Phalanx', legendLabel: 'Distal phalanx', detail: 'Terminal phalanx bearing the nail bed. Tuft fractures and nail bed injuries are common.' },
    scaphoid: { title: 'Scaphoid', legendLabel: 'Scaphoid', detail: 'Most commonly fractured carpal bone. Fractures may not show on initial X-ray; risk of avascular necrosis.' },
    lunate: { title: 'Lunate', legendLabel: 'Lunate', detail: 'Crescent-shaped carpal bone. Lunate dislocation can compress median nerve (carpal tunnel).' },
    thumb: { title: 'Thumb', legendLabel: 'Thumb', detail: 'Has only 2 phalanges (proximal and distal). Opposable thumb enables grip; critical for hand function.' }
};

const FOOT_MESH_DETAILS = {
    calcaneus: { title: 'Calcaneus', legendLabel: 'Calcaneus', detail: 'Largest tarsal bone forming the heel. Calcaneal fractures from falls; Achilles tendon attachment.' },
    talus: { title: 'Talus', legendLabel: 'Talus', detail: 'Sits atop calcaneus, articulating with tibia/fibula. Key bone in ankle joint mechanics.' },
    navicular: { title: 'Navicular', legendLabel: 'Navicular', detail: 'Boat-shaped bone on medial foot. Stress fractures common in athletes; accessory navicular variant.' },
    cuboid: { title: 'Cuboid', legendLabel: 'Cuboid', detail: 'Lateral tarsal bone. Supports 4th and 5th metatarsals; nutcracker fractures from forced abduction.' },
    metatarsals_foot: { title: 'Metatarsals', legendLabel: 'Metatarsals', detail: 'Five long bones of midfoot. March fractures (stress fractures of 2nd/3rd) from prolonged walking.' },
    phalanges_foot: { title: 'Phalanges', legendLabel: 'Phalanges', detail: 'Fourteen bones forming toes. Great toe has 2; others have 3. Hammer toe and bunion deformities.' },
    arch: { title: 'Medial Arch', legendLabel: 'Medial arch', detail: 'Longitudinal arch maintained by plantar fascia and ligaments. Flat feet (pes planus) cause pain.' },
    cuneiforms: { title: 'Cuneiforms', legendLabel: 'Cuneiforms', detail: 'Three wedge-shaped bones (medial, intermediate, lateral). Support the medial longitudinal arch.' }
};

const PELVIS_MESH_DETAILS = {
    ilium_pelvis: { title: 'Ilium', legendLabel: 'Ilium', detail: 'Largest pelvic bone with iliac crest. Iliac crest is a landmark for bone marrow biopsy and lumbar puncture level.' },
    ischium: { title: 'Ischium', legendLabel: 'Ischium', detail: 'Inferior posterior pelvic bone. Ischial tuberosity bears weight when sitting; ischial bursitis.' },
    pubis: { title: 'Pubis', legendLabel: 'Pubis', detail: 'Anterior inferior pelvic bone. Forms anterior arch; pubic ramus fractures in elderly.' },
    sacrum_pelvis: { title: 'Sacrum', legendLabel: 'Sacrum', detail: 'Triangular bone of 5 fused vertebrae. Contains sacral foramina for nerve root exit.' },
    coccyx: { title: 'Coccyx', legendLabel: 'Coccyx', detail: 'Small triangular bone below sacrum. Coccydynia (tailbone pain) from falls or prolonged sitting.' },
    acetabulum_pelvis: { title: 'Acetabulum', legendLabel: 'Acetabulum', detail: 'Hip socket formed by ilium, ischium, and pubis. Houses femoral head in hip joint.' },
    pubic_symphysis: { title: 'Pubic Symphysis', legendLabel: 'Pubic symphysis', detail: 'Cartilaginous joint uniting left and right pubic bones. Widens during pregnancy.' },
    pelvic_inlet: { title: 'Pelvic Inlet', legendLabel: 'Pelvic inlet', detail: 'Upper pelvic opening. Obstetric conjugate diameter determines birth canal adequacy.' }
};

const MUSCULAR_SYSTEM_MESH_DETAILS = {
    pectoralis: { title: 'Pectoralis', legendLabel: 'Pectoralis', detail: 'Large fan-shaped chest muscle. Pectoralis major enables arm adduction and internal rotation.' },
    biceps: { title: 'Biceps', legendLabel: 'Biceps', detail: 'Two-headed arm flexor. Biceps reflex tests C5-C6 nerve roots; common tendon rupture site.' },
    quadriceps: { title: 'Quadriceps', legendLabel: 'Quadriceps', detail: 'Four-headed anterior thigh muscle. Strongest muscle group; vastus lateralis used for IM injection in infants.' },
    deltoid_muscle: { title: 'Deltoid', legendLabel: 'Deltoid', detail: 'Triangular shoulder muscle. Primary IM injection site in adults. Three parts: anterior, middle, posterior.' },
    trapezius: { title: 'Trapezius', legendLabel: 'Trapezius', detail: 'Large diamond-shaped back muscle. Elevates, retracts, and rotates scapula. Assessed for CN XI function.' },
    abdominals: { title: 'Abdominals', legendLabel: 'Abdominals', detail: 'Rectus abdominis and obliques protecting abdominal organs. Assessed for guarding and rigidity.' },
    gastrocnemius: { title: 'Gastrocnemius', legendLabel: 'Gastrocnemius', detail: 'Calf muscle (2 heads). Achilles reflex tests S1-S2. Deep vein thrombosis can cause calf tenderness.' },
    latissimus: { title: 'Latissimus Dorsi', legendLabel: 'Latissimus dorsi', detail: 'Broadest back muscle. Enables arm extension and adduction. Used in reconstructive flap surgery.' }
};

const DIGESTIVE_SYSTEM_MESH_DETAILS = {
    esophagus_tube: { title: 'Esophagus', legendLabel: 'Esophagus', detail: 'Muscular tube (~25 cm) connecting pharynx to stomach. Transports food via peristalsis. Key landmark for NG tube placement and dysphagia assessment.' },
    stomach_organ: { title: 'Stomach', legendLabel: 'Stomach', detail: 'J-shaped hollow organ performing mechanical and chemical digestion. Produces HCl and pepsin. Gastric ulcers and GERD are common conditions.' },
    liver_organ: { title: 'Liver', legendLabel: 'Liver', detail: 'Largest solid organ (~1.5 kg). Metabolizes drugs, produces bile, stores glycogen, and detoxifies blood. Assessed for hepatomegaly by percussion.' },
    gallbladder_organ: { title: 'Gallbladder', legendLabel: 'Gallbladder', detail: 'Pear-shaped sac storing and concentrating bile. Murphy\'s sign positive in cholecystitis. Gallstones can obstruct common bile duct.' },
    small_intestine_tract: { title: 'Small Intestine', legendLabel: 'Small intestine', detail: 'Six-meter tube (duodenum, jejunum, ileum) where most digestion and nutrient absorption occurs. Key for understanding enteral feeding.' },
    large_intestine_tract: { title: 'Large Intestine', legendLabel: 'Large intestine', detail: 'Absorbs water and electrolytes, forms and stores feces. Important for understanding colitis, diverticulosis, and ostomy care.' }
};

const SMALL_INTESTINE_MESH_DETAILS = {
    duodenum: { title: 'Duodenum', legendLabel: 'Duodenum', detail: 'C-shaped first 25cm receiving bile and pancreatic juice. Duodenal ulcers are posterior; risk of hemorrhage.' },
    jejunum: { title: 'Jejunum', legendLabel: 'Jejunum', detail: 'Middle section with thick walls and prominent circular folds. Primary site of nutrient absorption.' },
    ileum: { title: 'Ileum', legendLabel: 'Ileum', detail: 'Terminal section with Peyer\'s patches (lymphoid tissue). Site of B12 and bile salt absorption; Crohn\'s disease.' },
    villi: { title: 'Villi', legendLabel: 'Villi', detail: 'Finger-like projections of mucosa increasing surface area 600-fold. Villous atrophy in celiac disease.' },
    plicae_circulares: { title: 'Plicae Circulares', legendLabel: 'Plicae circulares', detail: 'Permanent circular folds of mucosa and submucosa. Most prominent in jejunum; slow chyme passage.' },
    mesentery: { title: 'Mesentery', legendLabel: 'Mesentery', detail: 'Double-layered peritoneal fold anchoring intestine. Contains blood vessels, lymphatics, and nerves.' },
    ileocecal_valve: { title: 'Ileocecal Valve', legendLabel: 'Ileocecal valve', detail: 'Sphincter between ileum and cecum. Prevents backflow of colonic contents; can be site of obstruction.' },
    brunner_glands: { title: 'Brunner\'s Glands', legendLabel: 'Brunner\'s glands', detail: 'Mucous glands in duodenal submucosa. Secrete alkaline mucus protecting from gastric acid.' }
};

const LARGE_INTESTINE_MESH_DETAILS = {
    cecum: { title: 'Cecum', legendLabel: 'Cecum', detail: 'Blind-ended pouch at junction of small and large intestine. Receives ileal contents through ileocecal valve.' },
    ascending_colon: { title: 'Ascending Colon', legendLabel: 'Ascending colon', detail: 'Rises on right side to hepatic flexure. Retroperitoneal; cancer here presents with iron-deficiency anemia.' },
    transverse_colon: { title: 'Transverse Colon', legendLabel: 'Transverse colon', detail: 'Crosses abdomen between hepatic and splenic flexures. Most mobile segment; hangs from transverse mesocolon.' },
    descending_colon: { title: 'Descending Colon', legendLabel: 'Descending colon', detail: 'Descends on left side from splenic flexure. Retroperitoneal; diverticulosis most common here.' },
    sigmoid_colon: { title: 'Sigmoid Colon', legendLabel: 'Sigmoid colon', detail: 'S-shaped segment connecting descending colon to rectum. Volvulus (twisting) most common here.' },
    rectum: { title: 'Rectum', legendLabel: 'Rectum', detail: 'Terminal 12cm storing feces before defecation. Rectal examination for prostate, masses, and fecal impaction.' },
    appendix: { title: 'Appendix', legendLabel: 'Appendix', detail: 'Vestigial tube attached to cecum. Appendicitis: McBurney\'s point tenderness (RLQ).' },
    anal_canal: { title: 'Anal Canal', legendLabel: 'Anal canal', detail: 'Terminal 4cm with internal and external sphincters. Hemorrhoids, fissures, and abscesses occur here.' }
};

const PANCREAS_MESH_DETAILS = {
    head_pancreas: { title: 'Head', legendLabel: 'Head', detail: 'Nestled in C-curve of duodenum. Most pancreatic cancers arise here, causing obstructive jaundice.' },
    body_pancreas: { title: 'Body', legendLabel: 'Body', detail: 'Central portion anterior to aorta and L1-L2. Pancreatitis pain radiates to back from this region.' },
    tail_pancreas: { title: 'Tail', legendLabel: 'Tail', detail: 'Extends to splenic hilum. Contains highest concentration of islets; tail resection for distal tumors.' },
    pancreatic_duct: { title: 'Pancreatic Duct', legendLabel: 'Pancreatic duct', detail: 'Main duct (of Wirsung) carrying enzymes to duodenum. Obstruction causes acute pancreatitis.' },
    islets_langerhans: { title: 'Islets of Langerhans', legendLabel: 'Islets of Langerhans', detail: 'Endocrine cell clusters producing insulin (beta), glucagon (alpha), and somatostatin (delta cells).' },
    uncinate_process: { title: 'Uncinate Process', legendLabel: 'Uncinate process', detail: 'Hook-shaped process behind superior mesenteric vessels. Involvement complicates surgical resection.' },
    common_bile_duct_pancreas: { title: 'Common Bile Duct', legendLabel: 'Common bile duct', detail: 'Passes through or behind pancreatic head. Gallstone impaction here causes gallstone pancreatitis.' },
    ampulla_vater: { title: 'Ampulla of Vater', legendLabel: 'Ampulla of Vater', detail: 'Junction of pancreatic and bile ducts entering duodenum. Ampullary cancer causes painless jaundice.' }
};

const TONGUE_MESH_DETAILS = {
    dorsum: { title: 'Dorsum', legendLabel: 'Dorsum', detail: 'Upper surface bearing papillae and taste buds. Inspect for coating, color changes, and lesions.' },
    ventral_surface: { title: 'Ventral Surface', legendLabel: 'Ventral surface', detail: 'Underside with visible veins and frenulum. Sublingual medication absorption site; ranula cysts occur here.' },
    taste_buds: { title: 'Taste Buds', legendLabel: 'Taste buds', detail: 'Chemoreceptors for sweet, sour, salty, bitter, and umami. Taste loss occurs in CN VII and IX lesions.' },
    frenulum: { title: 'Frenulum', legendLabel: 'Frenulum', detail: 'Midline fold connecting ventral tongue to floor of mouth. Ankyloglossia (tongue-tie) restricts movement.' },
    intrinsic_muscles: { title: 'Intrinsic Muscles', legendLabel: 'Intrinsic muscles', detail: 'Four muscles within tongue body altering shape. Enable complex movements for speech and swallowing.' },
    extrinsic_muscles: { title: 'Extrinsic Muscles', legendLabel: 'Extrinsic muscles', detail: 'Four muscles connecting tongue to skull and hyoid. Genioglossus protrusion tests CN XII (hypoglossal).' },
    lingual_tonsil: { title: 'Lingual Tonsil', legendLabel: 'Lingual tonsil', detail: 'Lymphoid tissue at tongue base. Part of Waldeyer\'s ring; can obstruct airway when enlarged.' },
    papillae: { title: 'Papillae', legendLabel: 'Papillae', detail: 'Projections on dorsum: filiform (touch), fungiform (taste), circumvallate (taste). Atrophy in B12 deficiency.' }
};

const LARYNX_MESH_DETAILS = {
    epiglottis: { title: 'Epiglottis', legendLabel: 'Epiglottis', detail: 'Leaf-shaped cartilage deflecting food from airway during swallowing. Visualized during laryngoscopy for intubation.' },
    thyroid_cartilage: { title: 'Thyroid Cartilage', legendLabel: 'Thyroid cartilage', detail: 'Largest laryngeal cartilage forming Adam\'s apple. Landmark for palpation and emergency airway access.' },
    cricoid_cartilage: { title: 'Cricoid Cartilage', legendLabel: 'Cricoid cartilage', detail: 'Complete cartilaginous ring below thyroid cartilage. Landmark for cricoid pressure (Sellick\'s maneuver).' },
    vocal_cords: { title: 'Vocal Cords', legendLabel: 'Vocal cords', detail: 'Paired folds of mucous membrane vibrating to produce sound. Paralysis causes hoarseness (recurrent laryngeal nerve).' },
    tracheal_rings: { title: 'Tracheal Rings', legendLabel: 'Tracheal rings', detail: 'C-shaped hyaline cartilage rings maintaining tracheal patency. 16-20 rings; tracheostomy between 2nd-4th.' },
    arytenoid: { title: 'Arytenoid Cartilage', legendLabel: 'Arytenoid cartilage', detail: 'Paired pyramidal cartilages controlling vocal cord tension and position. Move during phonation.' },
    glottis: { title: 'Glottis', legendLabel: 'Glottis', detail: 'Opening between vocal cords. Narrowest point in adult airway; spasm causes stridor.' },
    cricothyroid_membrane: { title: 'Cricothyroid Membrane', legendLabel: 'Cricothyroid membrane', detail: 'Fibrous membrane between thyroid and cricoid cartilage. Site for emergency cricothyrotomy.' }
};

const DIAPHRAGM_MESH_DETAILS = {
    central_tendon: { title: 'Central Tendon', legendLabel: 'Central tendon', detail: 'Clover-leaf shaped tendinous center. Right hemidiaphragm higher due to liver; depression suggests pathology.' },
    right_crus: { title: 'Right Crus', legendLabel: 'Right crus', detail: 'Muscular pillar from L1-L3 vertebral bodies. Longer and thicker than left; forms right border of aortic hiatus.' },
    left_crus: { title: 'Left Crus', legendLabel: 'Left crus', detail: 'Muscular pillar from L1-L2. Forms left border of esophageal hiatus; contraction aids lower esophageal sphincter.' },
    aortic_hiatus: { title: 'Aortic Hiatus', legendLabel: 'Aortic hiatus', detail: 'Opening at T12 level transmitting aorta and thoracic duct. Posterior and fixed; aorta does not constrict.' },
    esophageal_hiatus: { title: 'Esophageal Hiatus', legendLabel: 'Esophageal hiatus', detail: 'Opening at T10 level transmitting esophagus and vagus nerves. Hiatal hernia occurs when stomach herniates.' },
    caval_opening: { title: 'Caval Opening', legendLabel: 'Caval opening', detail: 'Opening at T8 in central tendon for inferior vena cava. Opens during inspiration aiding venous return.' },
    costal_part: { title: 'Costal Part', legendLabel: 'Costal part', detail: 'Largest part originating from inner surfaces of lower 6 ribs. Primary motor area for respiration.' },
    sternal_part: { title: 'Sternal Part', legendLabel: 'Sternal part', detail: 'Smallest part from posterior xiphoid process. Retrosternal hernias (Morgagni) can occur here.' }
};

const BLADDER_MESH_DETAILS = {
    detrusor: { title: 'Detrusor Muscle', legendLabel: 'Detrusor muscle', detail: 'Three-layered smooth muscle wall contracting during micturition. Overactivity causes urge incontinence.' },
    trigone: { title: 'Trigone', legendLabel: 'Trigone', detail: 'Triangular smooth area between ureteral orifices and internal urethral orifice. Most common site of bladder cancer.' },
    ureteral_orifice: { title: 'Ureteral Orifice', legendLabel: 'Ureteral orifice', detail: 'Points where ureters enter bladder wall obliquely. Flap-valve mechanism prevents vesicoureteral reflux.' },
    internal_sphincter: { title: 'Internal Sphincter', legendLabel: 'Internal sphincter', detail: 'Smooth muscle sphincter at bladder neck. Involuntary control; relaxes during parasympathetic stimulation.' },
    external_sphincter: { title: 'External Sphincter', legendLabel: 'External sphincter', detail: 'Skeletal muscle sphincter under voluntary control. Damaged during prostatectomy causing incontinence.' },
    dome: { title: 'Dome', legendLabel: 'Dome', detail: 'Superior expandable surface covered by peritoneum. Distended bladder is palpable above pubic symphysis.' },
    neck: { title: 'Neck', legendLabel: 'Neck', detail: 'Inferior funnel-shaped region leading to urethra. Bladder neck obstruction common in prostatic hyperplasia.' },
    mucosa_bladder: { title: 'Mucosa', legendLabel: 'Mucosa', detail: 'Transitional epithelium (urothelium) that stretches with filling. Rugae flatten as bladder fills.' }
};

const URINARY_SYSTEM_MESH_DETAILS = {
    kidney_cortex: { title: 'Renal Cortex', legendLabel: 'Renal cortex', detail: 'Outer kidney layer containing glomeruli and convoluted tubules. Site of blood filtration and reabsorption.' },
    kidney_medulla: { title: 'Renal Medulla', legendLabel: 'Renal medulla', detail: 'Inner kidney region with renal pyramids. Contains loops of Henle concentrating urine.' },
    renal_pelvis: { title: 'Renal Pelvis', legendLabel: 'Renal pelvis', detail: 'Funnel-shaped collecting area draining into ureter. Renal pelvis dilation (hydronephrosis) from obstruction.' },
    ureter: { title: 'Ureter', legendLabel: 'Ureter', detail: 'Muscular tubes (25-30cm) conducting urine by peristalsis. Three narrowings where stones can impact.' },
    bladder_urinary: { title: 'Bladder', legendLabel: 'Bladder', detail: 'Muscular reservoir storing urine. Capacity 400-600mL; catheterization required when retention occurs.' },
    urethra: { title: 'Urethra', legendLabel: 'Urethra', detail: 'Terminal passage: 20cm male (prostatic, membranous, spongy), 4cm female. UTIs more common in females.' },
    renal_artery: { title: 'Renal Artery', legendLabel: 'Renal artery', detail: 'Branch of aorta carrying 20-25% of cardiac output to each kidney. Stenosis causes renovascular hypertension.' },
    adrenal: { title: 'Adrenal Gland', legendLabel: 'Adrenal gland', detail: 'Endocrine gland atop each kidney. Produces cortisol, aldosterone, and catecholamines.' }
};

const ADRENAL_GLAND_MESH_DETAILS = {
    zona_glomerulosa: { title: 'Zona Glomerulosa', legendLabel: 'Zona glomerulosa', detail: 'Outermost cortical zone producing mineralocorticoids (aldosterone). Regulates Na+/K+ and blood pressure.' },
    zona_fasciculata: { title: 'Zona Fasciculata', legendLabel: 'Zona fasciculata', detail: 'Middle cortical zone producing glucocorticoids (cortisol). Largest zone; cortisol regulates metabolism and stress response.' },
    zona_reticularis: { title: 'Zona Reticularis', legendLabel: 'Zona reticularis', detail: 'Innermost cortical zone producing androgens (DHEA). Excess causes virilization; adrenal tumors.' },
    adrenal_medulla: { title: 'Medulla', legendLabel: 'Medulla', detail: 'Central portion producing catecholamines (epinephrine, norepinephrine). Pheochromocytoma causes hypertensive crises.' },
    cortex_outer: { title: 'Cortex', legendLabel: 'Cortex', detail: 'Outer region comprising three zones. Cortical insufficiency (Addison\'s) causes hypotension and hyperpigmentation.' },
    capsule_adrenal: { title: 'Capsule', legendLabel: 'Capsule', detail: 'Fibrous outer covering. Protects gland; important surgical landmark during adrenalectomy.' },
    adrenal_vein: { title: 'Adrenal Vein', legendLabel: 'Adrenal vein', detail: 'Right drains to IVC, left to left renal vein. Asymmetry important for surgical approach.' },
    chromaffin_cells: { title: 'Chromaffin Cells', legendLabel: 'Chromaffin cells', detail: 'Modified postganglionic sympathetic neurons. Release catecholamines directly into blood during fight-or-flight.' }
};

const MALE_REPRODUCTIVE_MESH_DETAILS = {
    testis: { title: 'Testis', legendLabel: 'Testis', detail: 'Paired gonads producing sperm and testosterone. Testicular self-examination for cancer screening. Torsion is emergency.' },
    epididymis: { title: 'Epididymis', legendLabel: 'Epididymis', detail: 'Coiled tube posterior to testis for sperm maturation and storage. Epididymitis causes scrotal pain.' },
    vas_deferens: { title: 'Vas Deferens', legendLabel: 'Vas deferens', detail: 'Muscular tube transporting sperm from epididymis. Cut during vasectomy; reconectable in vasovasostomy.' },
    seminal_vesicle: { title: 'Seminal Vesicle', legendLabel: 'Seminal vesicle', detail: 'Paired glands producing fructose-rich seminal fluid (60-70% of ejaculate volume).' },
    prostate: { title: 'Prostate', legendLabel: 'Prostate', detail: 'Walnut-sized gland surrounding urethra. BPH causes urinary obstruction; PSA screens for prostate cancer.' },
    urethra_male: { title: 'Urethra', legendLabel: 'Urethra', detail: 'Three sections: prostatic, membranous, penile (spongy). Longest male urethra; catheter sizing important.' },
    penis_structure: { title: 'Penis', legendLabel: 'Penis', detail: 'Contains erectile tissue (2 corpora cavernosa, 1 corpus spongiosum). Erection via parasympathetic vasodilation.' },
    scrotum: { title: 'Scrotum', legendLabel: 'Scrotum', detail: 'External sac containing testes. Thermoregulation 2-3\u00B0C below body temp for spermatogenesis. Inspect for swelling.' }
};

const FEMALE_REPRODUCTIVE_MESH_DETAILS = {
    ovary: { title: 'Ovary', legendLabel: 'Ovary', detail: 'Paired almond-shaped gonads producing ova and hormones (estrogen, progesterone). Ovarian cysts and tumors.' },
    fallopian_tube: { title: 'Fallopian Tube', legendLabel: 'Fallopian tube', detail: 'Tubes connecting ovaries to uterus. Fimbriae capture ova; ectopic pregnancy most common here.' },
    uterus_body: { title: 'Uterus', legendLabel: 'Uterus', detail: 'Pear-shaped muscular organ for fetal development. Fundal height assessment during pregnancy.' },
    cervix: { title: 'Cervix', legendLabel: 'Cervix', detail: 'Lower narrow portion opening to vagina. Pap smear for cancer screening; effacement and dilation in labor.' },
    vagina: { title: 'Vagina', legendLabel: 'Vagina', detail: 'Fibromuscular canal from cervix to vulva. Birth canal; vaginal examination for labor assessment.' },
    endometrium: { title: 'Endometrium', legendLabel: 'Endometrium', detail: 'Inner mucosal lining that thickens each menstrual cycle. Shed during menstruation; implantation site.' },
    myometrium: { title: 'Myometrium', legendLabel: 'Myometrium', detail: 'Thick smooth muscle layer of uterus. Contractions during labor; oxytocin stimulates, tocolytics inhibit.' },
    broad_ligament: { title: 'Broad Ligament', legendLabel: 'Broad ligament', detail: 'Peritoneal fold supporting uterus and tubes. Contains uterine artery; important surgical landmark.' }
};

const SPINAL_CORD_MESH_DETAILS = {
    gray_matter: { title: 'Gray Matter', legendLabel: 'Gray matter', detail: 'Butterfly-shaped center containing neuron cell bodies. Organized into horns; damage causes LMN signs.' },
    white_matter: { title: 'White Matter', legendLabel: 'White matter', detail: 'Outer myelinated axon tracts. Contains ascending (sensory) and descending (motor) pathways.' },
    dorsal_horn: { title: 'Dorsal Horn', legendLabel: 'Dorsal horn', detail: 'Posterior gray matter receiving sensory input. Substantia gelatinosa processes pain signals (gate theory).' },
    ventral_horn: { title: 'Ventral Horn', legendLabel: 'Ventral horn', detail: 'Anterior gray matter containing motor neurons. Alpha motor neurons innervate skeletal muscle.' },
    dorsal_root: { title: 'Dorsal Root', legendLabel: 'Dorsal root', detail: 'Carries sensory (afferent) fibers into spinal cord. Dorsal root ganglia contain sensory neuron cell bodies.' },
    ventral_root: { title: 'Ventral Root', legendLabel: 'Ventral root', detail: 'Carries motor (efferent) fibers from spinal cord. Ventral root lesions cause LMN weakness.' },
    meninges_cord: { title: 'Meninges', legendLabel: 'Meninges', detail: 'Three protective layers: dura, arachnoid, pia mater. Epidural space for anesthesia; CSF in subarachnoid.' },
    central_canal: { title: 'Central Canal', legendLabel: 'Central canal', detail: 'Narrow channel containing CSF in center of cord. Syringomyelia: pathological dilation causes deficits.' }
};

const INNER_EAR_MESH_DETAILS = {
    cochlea: { title: 'Cochlea', legendLabel: 'Cochlea', detail: 'Snail-shaped structure with 2.5 turns. Contains organ of Corti for sound transduction; tonotopic organization.' },
    vestibule: { title: 'Vestibule', legendLabel: 'Vestibule', detail: 'Central chamber containing utricle and saccule. Otolith organs detect linear acceleration and head position.' },
    semicircular_canals: { title: 'Semicircular Canals', legendLabel: 'Semicircular canals', detail: 'Three perpendicular fluid-filled loops detecting rotational movement. BPPV from displaced otoconia.' },
    oval_window: { title: 'Oval Window', legendLabel: 'Oval window', detail: 'Membrane between middle and inner ear receiving stapes vibrations. Otosclerosis fixes stapes here.' },
    round_window: { title: 'Round Window', legendLabel: 'Round window', detail: 'Membrane below oval window releasing sound pressure. Acts as pressure relief valve for cochlear fluid.' },
    organ_corti: { title: 'Organ of Corti', legendLabel: 'Organ of Corti', detail: 'Sensory epithelium on basilar membrane. Hair cells transduce mechanical vibration to neural signals.' },
    auditory_nerve: { title: 'Auditory Nerve', legendLabel: 'Auditory nerve', detail: 'Vestibulocochlear nerve (CN VIII) carrying hearing and balance signals. Acoustic neuroma compresses it.' },
    endolymph: { title: 'Endolymph', legendLabel: 'Endolymph', detail: 'Potassium-rich fluid filling membranous labyrinth. Endolymphatic hydrops causes Meniere\'s disease.' }
};

const THYROID_MESH_DETAILS = {
    right_lobe_thyroid: { title: 'Right Lobe', legendLabel: 'Right lobe', detail: 'Lateral lobe overlying tracheal rings 2-3. Palpated during thyroid examination; nodules assessed by ultrasound.' },
    left_lobe_thyroid: { title: 'Left Lobe', legendLabel: 'Left lobe', detail: 'Lateral lobe mirroring right. Moves with swallowing during physical examination (distinguishes from other neck masses).' },
    isthmus: { title: 'Isthmus', legendLabel: 'Isthmus', detail: 'Narrow bridge connecting lobes across trachea. Divided during thyroidectomy; important surgical landmark.' },
    pyramidal_lobe: { title: 'Pyramidal Lobe', legendLabel: 'Pyramidal lobe', detail: 'Vestigial lobe extending superiorly from isthmus. Present in ~50% of people; thyroglossal duct remnant.' },
    follicular_cells: { title: 'Follicular Cells', legendLabel: 'Follicular cells', detail: 'Epithelial cells producing T3 and T4 hormones. Regulated by TSH; iodine essential for synthesis.' },
    parafollicular_cells: { title: 'C-Cells', legendLabel: 'C-cells', detail: 'Parafollicular (C) cells producing calcitonin. Lowers blood calcium; medullary thyroid cancer arises here.' },
    parathyroid: { title: 'Parathyroid', legendLabel: 'Parathyroid', detail: 'Usually 4 small glands on posterior thyroid surface. Produce PTH regulating calcium; protect during thyroid surgery.' },
    thyroid_vessels: { title: 'Blood Vessels', legendLabel: 'Blood vessels', detail: 'Superior and inferior thyroid arteries provide rich blood supply. Ligated during thyroidectomy to prevent hemorrhage.' }
};

const PITUITARY_MESH_DETAILS = {
    hypothalamus_pituitary: { title: 'Hypothalamus & Pituitary', legendLabel: 'Hypothalamus & pituitary', detail: 'Master endocrine complex. Hypothalamus releases hormones controlling anterior pituitary (GH, ACTH, TSH, FSH, LH, prolactin) and stores ADH/oxytocin in posterior pituitary.' },
    optic_chiasm_pit: { title: 'Optic Chiasm', legendLabel: 'Optic chiasm', detail: 'X-shaped structure above pituitary where optic nerves cross. Pituitary tumors compress it causing bitemporal hemianopia.' },
    thalamus: { title: 'Thalamus', legendLabel: 'Thalamus', detail: 'Major sensory relay center. Relays signals between subcortical areas and cerebral cortex. Connected to hypothalamus via neural pathways.' },
    mammillary_bodies: { title: 'Mammillary Bodies', legendLabel: 'Mammillary bodies', detail: 'Paired structures at base of hypothalamus involved in memory. Damage causes Wernicke-Korsakoff syndrome seen in chronic alcoholism.' },
    hippocampus: { title: 'Hippocampus', legendLabel: 'Hippocampus', detail: 'Key structure for memory formation. Connected to hypothalamus via fornix. Stress hormones from HPA axis can damage hippocampal neurons.' },
    amygdala: { title: 'Amygdala', legendLabel: 'Amygdala', detail: 'Almond-shaped structure processing emotions and fear. Activates the HPA axis stress response triggering cortisol release via pituitary.' },
    pineal_gland: { title: 'Pineal Gland', legendLabel: 'Pineal gland', detail: 'Endocrine gland producing melatonin regulating circadian rhythm. Important for sleep-wake cycle management in nursing care.' },
    brain_stem_pit: { title: 'Brain Stem', legendLabel: 'Brain stem', detail: 'Contains pons and medulla. Controls vital autonomic functions (breathing, heart rate, blood pressure). Hypothalamus connects to brainstem autonomic centers.' }
};

const LYMPH_NODE_MESH_DETAILS = {
    cortex_lymph: { title: 'Cortex', legendLabel: 'Cortex', detail: 'Outer region with B-cell follicles. Primary site of antibody production; enlarges during infection.' },
    paracortex: { title: 'Paracortex', legendLabel: 'Paracortex', detail: 'Region between cortex and medulla rich in T-cells. Antigen presentation occurs here; depleted in HIV.' },
    medulla_lymph: { title: 'Medulla', legendLabel: 'Medulla', detail: 'Inner region with medullary cords and sinuses. Contains plasma cells and macrophages filtering lymph.' },
    germinal_center: { title: 'Germinal Center', legendLabel: 'Germinal center', detail: 'Active centers within follicles where B-cells proliferate and mature. Enlarged in reactive lymphadenopathy.' },
    afferent_vessel: { title: 'Afferent Vessel', legendLabel: 'Afferent vessel', detail: 'Multiple vessels bringing lymph into node. Enter at various points around capsule.' },
    efferent_vessel: { title: 'Efferent Vessel', legendLabel: 'Efferent vessel', detail: 'Single vessel exiting at hilum carrying filtered lymph. Contains antibodies and activated lymphocytes.' },
    hilum_lymph: { title: 'Hilum', legendLabel: 'Hilum', detail: 'Indented region where efferent vessel and blood vessels enter/exit. Landmark for surgical identification.' },
    capsule_lymph: { title: 'Capsule', legendLabel: 'Capsule', detail: 'Fibrous outer covering with trabeculae extending inward. Provides structural support; breached in metastatic cancer.' }
};

const EAR_MESH_DETAILS = {
    pinna: { title: 'Pinna (Auricle)', legendLabel: 'Pinna', detail: 'External ear cartilage collecting sound waves. Landmarks: helix, antihelix, tragus, lobule. Assess for deformities.' },
    ear_canal: { title: 'Ear Canal', legendLabel: 'Ear canal', detail: 'S-shaped tube (2.5cm) directing sound to tympanic membrane. Cerumen impaction; pull pinna up and back for otoscopy.' },
    tympanic_membrane: { title: 'Tympanic Membrane', legendLabel: 'Tympanic membrane', detail: 'Thin membrane vibrating with sound waves. Pearl-gray, translucent; bulging/red in otitis media.' },
    malleus: { title: 'Malleus', legendLabel: 'Malleus', detail: 'Hammer-shaped ossicle attached to tympanic membrane. Handle visible on otoscopy as manubrium landmark.' },
    incus: { title: 'Incus', legendLabel: 'Incus', detail: 'Anvil-shaped middle ossicle connecting malleus to stapes. Most commonly eroded ossicle in chronic otitis.' },
    stapes: { title: 'Stapes', legendLabel: 'Stapes', detail: 'Stirrup-shaped smallest bone transmitting vibration to oval window. Fixed in otosclerosis causing conductive hearing loss.' },
    eustachian_tube: { title: 'Eustachian Tube', legendLabel: 'Eustachian tube', detail: 'Connects middle ear to nasopharynx equalizing pressure. Dysfunction causes serous otitis; patent in children.' },
    mastoid: { title: 'Mastoid Process', legendLabel: 'Mastoid process', detail: 'Posterior temporal bone containing air cells. Mastoiditis: serious complication of untreated otitis media.' }
};

const BLOOD_CELLS_MESH_DETAILS = {
    rbc: { title: 'Red Blood Cell', legendLabel: 'Red blood cell', detail: 'Biconcave disc carrying oxygen via hemoglobin. 4-5 million/\u03BCL; low count = anemia. No nucleus; 120-day lifespan.' },
    neutrophil: { title: 'Neutrophil', legendLabel: 'Neutrophil', detail: 'Most abundant WBC (60-70%). First responder to bacterial infection. Elevated = left shift; bands indicate acute infection.' },
    lymphocyte: { title: 'Lymphocyte', legendLabel: 'Lymphocyte', detail: 'Second most abundant WBC. T-cells (cellular immunity) and B-cells (antibody production). Low in HIV/AIDS.' },
    monocyte: { title: 'Monocyte', legendLabel: 'Monocyte', detail: 'Largest WBC becoming tissue macrophages. Phagocytosis of pathogens and debris. Elevated in chronic infection.' },
    eosinophil: { title: 'Eosinophil', legendLabel: 'Eosinophil', detail: 'Bilobed nucleus with red granules. Elevated in parasitic infections and allergic reactions.' },
    basophil: { title: 'Basophil', legendLabel: 'Basophil', detail: 'Rarest WBC with dark purple granules. Release histamine and heparin. Involved in allergic and inflammatory responses.' },
    platelet: { title: 'Platelet', legendLabel: 'Platelet', detail: 'Cell fragments from megakaryocytes essential for hemostasis. Normal 150,000-400,000/\u03BCL; low = thrombocytopenia.' },
    plasma: { title: 'Plasma', legendLabel: 'Plasma', detail: 'Liquid component (55% of blood volume). Contains proteins (albumin, globulins, fibrinogen), electrolytes, and waste.' }
};

const HUMAN_CELL_MESH_DETAILS = {
    nucleus: { title: 'Nucleus', legendLabel: 'Nucleus', detail: 'Contains DNA and controls cell activities. Nuclear envelope with pores; nucleolus makes ribosomal RNA.' },
    mitochondria: { title: 'Mitochondria', legendLabel: 'Mitochondria', detail: 'Powerhouse of the cell producing ATP via oxidative phosphorylation. Cyanide poisoning inhibits electron transport chain.' },
    endoplasmic_reticulum: { title: 'Endoplasmic Reticulum', legendLabel: 'Endoplasmic reticulum', detail: 'Network of membranes for protein (rough ER) and lipid (smooth ER) synthesis. Drug metabolism in hepatocyte smooth ER.' },
    golgi_apparatus: { title: 'Golgi Apparatus', legendLabel: 'Golgi apparatus', detail: 'Stacked membranes processing and packaging proteins for secretion. Modifies proteins with carbohydrates.' },
    cell_membrane: { title: 'Cell Membrane', legendLabel: 'Cell membrane', detail: 'Phospholipid bilayer with embedded proteins. Selective permeability; receptor sites for drugs and hormones.' },
    ribosome: { title: 'Ribosome', legendLabel: 'Ribosome', detail: 'Protein synthesis machinery reading mRNA. Free ribosomes make cytoplasmic proteins; bound make secretory proteins.' },
    lysosome: { title: 'Lysosome', legendLabel: 'Lysosome', detail: 'Membrane-bound vesicles containing digestive enzymes. Autophagy and pathogen destruction; lysosomal storage diseases.' },
    cytoplasm: { title: 'Cytoplasm', legendLabel: 'Cytoplasm', detail: 'Gel-like substance filling cell. Contains cytoskeleton, organelles, and dissolved molecules. Site of glycolysis.' }
};

const DNA_MESH_DETAILS = {
    double_helix: { title: 'Double Helix', legendLabel: 'Double helix', detail: 'Two antiparallel polynucleotide chains wound around each other. Right-handed B-form is most common in cells.' },
    base_pairs: { title: 'Base Pairs', legendLabel: 'Base pairs', detail: 'Complementary base pairing: A-T (2 H-bonds) and G-C (3 H-bonds). Specific pairing enables accurate replication.' },
    sugar_phosphate: { title: 'Sugar-Phosphate Backbone', legendLabel: 'Backbone', detail: 'Alternating deoxyribose sugar and phosphate groups forming the structural backbone. Phosphodiester bonds link nucleotides.' },
    adenine: { title: 'Adenine', legendLabel: 'Adenine', detail: 'Purine base pairing with thymine. Found in DNA only; replaced by uracil in RNA.' },
    thymine: { title: 'Thymine', legendLabel: 'Thymine', detail: 'Pyrimidine base pairing with adenine. Unique to DNA; thymine dimers from UV damage cause skin cancer.' },
    guanine: { title: 'Guanine', legendLabel: 'Guanine', detail: 'Purine base pairing with cytosine. Three hydrogen bonds make G-C pairs more stable than A-T.' },
    cytosine: { title: 'Cytosine', legendLabel: 'Cytosine', detail: 'Pyrimidine base pairing with guanine. Methylation of cytosine regulates gene expression (epigenetics).' },
    hydrogen_bonds: { title: 'Hydrogen Bonds', legendLabel: 'Hydrogen bonds', detail: 'Weak bonds between base pairs holding strands together. Allow separation during replication and transcription.' }
};

const IV_SETUP_MESH_DETAILS = {
    iv_bag: { title: 'IV Bag', legendLabel: 'IV bag', detail: 'Flexible container holding IV solution (NS, D5W, LR). Check for clarity, expiry, and correct solution before hanging.' },
    drip_chamber: { title: 'Drip Chamber', legendLabel: 'Drip chamber', detail: 'Clear chamber for counting drops per minute. Macro (10-20 gtt/mL) or micro (60 gtt/mL) drip sets.' },
    roller_clamp: { title: 'Roller Clamp', legendLabel: 'Roller clamp', detail: 'Adjustable clamp controlling flow rate by compressing tubing. Primary means of gravity flow rate control.' },
    tubing: { title: 'Tubing', legendLabel: 'Tubing', detail: 'Flexible PVC tubing connecting bag to patient. Prime to remove air; change per facility protocol (72-96h).' },
    y_port: { title: 'Y-Port', legendLabel: 'Y-port', detail: 'Injection port for secondary medications. Swab with alcohol before access; used for IV push medications.' },
    cannula: { title: 'Cannula', legendLabel: 'Cannula', detail: 'Catheter inserted into vein (18-24 gauge). Gauge selection based on therapy; 18G for blood, 22G for most infusions.' },
    flow_regulator: { title: 'Flow Regulator', legendLabel: 'Flow regulator', detail: 'Device providing precise flow control. Electronic pumps more accurate than gravity for critical medications.' },
    spike: { title: 'Spike', legendLabel: 'Spike', detail: 'Sharp plastic piece piercing IV bag port. Maintain sterility during setup; do not touch spike tip.' }
};

const CATHETER_MESH_DETAILS = {
    catheter_tip: { title: 'Catheter Tip', legendLabel: 'Catheter tip', detail: 'Rounded atraumatic tip for smooth insertion. Coude tip curved for prostatic navigation; straight tip standard.' },
    balloon: { title: 'Retention Balloon', legendLabel: 'Retention balloon', detail: 'Inflatable balloon (5-30mL) securing catheter in bladder. Always inflate with sterile water, never saline.' },
    drainage_lumen: { title: 'Drainage Lumen', legendLabel: 'Drainage lumen', detail: 'Main channel for urine drainage. Larger lumen provides better drainage; three-way catheters add irrigation lumen.' },
    inflation_lumen: { title: 'Inflation Lumen', legendLabel: 'Inflation lumen', detail: 'Small channel connected to balloon port for inflation/deflation. Use syringe to inflate with designated volume.' },
    drainage_port: { title: 'Drainage Port', legendLabel: 'Drainage port', detail: 'Connection point to drainage tubing and collection bag. Maintain closed system to prevent CAUTI.' },
    balloon_port: { title: 'Balloon Port', legendLabel: 'Balloon port', detail: 'Port for syringe to inflate/deflate retention balloon. Color-coded; stated volume on port label.' },
    catheter_shaft: { title: 'Shaft', legendLabel: 'Shaft', detail: 'Flexible silicone or latex tube body. Size measured in French (Fr); 14-16Fr typical adult. Latex allergy consideration.' },
    collection_bag: { title: 'Collection Bag', legendLabel: 'Collection bag', detail: 'Dependent container collecting drained urine. Keep below bladder level; empty when 2/3 full; measure I&O.' }
};

const GALLBLADDER_ORGAN_MESH_DETAILS = {
    gb_fundus: { title: 'Fundus', legendLabel: 'Fundus', detail: 'Rounded blind end projecting beyond liver edge. Palpable at 9th costal cartilage tip; Murphy\'s sign elicited here.' },
    gb_body: { title: 'Body', legendLabel: 'Body', detail: 'Main portion of gallbladder contacting liver visceral surface. Stores and concentrates bile between meals.' },
    gb_neck: { title: 'Neck', legendLabel: 'Neck', detail: 'Tapered portion leading to cystic duct. Hartmann\'s pouch at infundibulum is common site for gallstone impaction.' },
    cystic_duct: { title: 'Cystic Duct', legendLabel: 'Cystic duct', detail: 'Connects gallbladder to common hepatic duct. Contains spiral valves of Heister; stone impaction causes biliary colic.' },
    gb_mucosa: { title: 'Mucosa', legendLabel: 'Mucosa', detail: 'Columnar epithelium with rugae. Absorbs water and ions concentrating bile 5-10 fold. Rokitansky-Aschoff sinuses in inflammation.' },
    gb_serosa: { title: 'Serosa', legendLabel: 'Serosa', detail: 'Peritoneal covering on free surface. Liver-attached surface lacks serosa; important in gallbladder cancer spread.' },
    hepatic_surface: { title: 'Hepatic Surface', legendLabel: 'Hepatic surface', detail: 'Surface adhering to liver fossa. Inflammation here can spread to liver parenchyma (pericholecystic changes).' },
    gb_artery: { title: 'Cystic Artery', legendLabel: 'Cystic artery', detail: 'Branch of right hepatic artery in Calot\'s triangle. Must be identified and clipped during cholecystectomy.' }
};

const NEURON_MESH_DETAILS = {
    soma: { title: 'Cell Body (Soma)', legendLabel: 'Cell body (soma)', detail: 'Contains the nucleus and most organelles. Integrates incoming signals from dendrites and generates action potentials when threshold is reached.' },
    dendrites: { title: 'Dendrites', legendLabel: 'Dendrites', detail: 'Branch-like extensions receiving signals from other neurons via synapses. Dendritic spines increase surface area for thousands of synaptic contacts.' },
    axon: { title: 'Axon', legendLabel: 'Axon', detail: 'Long cylindrical projection conducting action potentials away from the soma. Motor neuron axons can extend up to 1 metre from spinal cord to muscle.' },
    myelin_sheath: { title: 'Myelin Sheath', legendLabel: 'Myelin sheath', detail: 'Insulating lipid layer formed by Schwann cells (PNS) or oligodendrocytes (CNS). Enables rapid saltatory conduction; demyelination occurs in multiple sclerosis.' },
    nodes_ranvier: { title: 'Nodes of Ranvier', legendLabel: 'Nodes of Ranvier', detail: 'Gaps between myelin segments where voltage-gated ion channels concentrate. Enable saltatory conduction increasing nerve impulse speed 10-100 fold.' },
    axon_terminal: { title: 'Axon Terminal', legendLabel: 'Axon terminal', detail: 'Synaptic boutons at axon ends containing neurotransmitter vesicles. Release acetylcholine, serotonin, dopamine, etc. into the synaptic cleft.' },
    synapse: { title: 'Synapse', legendLabel: 'Synapse', detail: 'Junction between presynaptic terminal and postsynaptic membrane. Neurotransmitters cross the 20-40nm cleft to bind receptors. Target for many drugs.' },
    axon_hillock: { title: 'Axon Hillock', legendLabel: 'Axon hillock', detail: 'Cone-shaped transition from soma to axon. Trigger zone with highest density of voltage-gated Na+ channels; initiates action potentials at threshold (-55mV).' }
};

function sanitizeBrainMeshKey(name) {
    let k = String(name)
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^\w\u0080-\uFFFF.]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 100);
    return k || 'mesh';
}

/**
 * Printed callouts 1–12 for Dr. Cheroske’s “Brain Model (Right) - General anatomy”
 * (Somso-based scan; https://sketchfab.com/3d-models/brain-model-right-general-anatomy-dfc9e4a0796b40c7893dd0dad8b25543 ).
 * glTF order: Object_2→1 … Object_13→12. If a label ever mismatches the Sketchfab/texture key,
 * reorder this map to match the model’s printed numbers.
 */
const CHEROSKE_SOMSO_RIGHT_BRAIN_CALLOUTS = {
    '1': {
        title: 'Frontal lobe',
        legendLabel: 'Frontal lobe',
        detail: 'Anterior cerebrum: executive function, personality, planning, and Broca’s area (dominant hemisphere) for expressive language. Damage causes contralateral weakness (if motor strip involved), disinhibition, or aphasia. Common territory for MCA frontal branches.'
    },
    '2': {
        title: 'Precentral gyrus',
        legendLabel: 'Precentral gyrus',
        detail: 'Primary motor cortex (homunculus). Upper motor neuron origin for voluntary movement on the opposite side of the body. Stroke here produces contralateral weakness with later spasticity; seizure focus can cause Jacksonian march.'
    },
    '3': {
        title: 'Postcentral gyrus',
        legendLabel: 'Postcentral gyrus',
        detail: 'Primary somatosensory cortex—discriminative touch, proprioception, vibration. Lesions cause sensory loss or cortical sensory signs on the contralateral side; relevant to stroke mapping and sensory exam.'
    },
    '4': {
        title: 'Parietal lobe',
        legendLabel: 'Parietal lobe',
        detail: 'Posterior to the sensory strip: spatial attention, praxis, and integration of somatic sensation. Nondominant injury classically associated with hemispatial neglect; dominant inferior parietal involvement with Gerstmann-type syndromes.'
    },
    '5': {
        title: 'Occipital lobe',
        legendLabel: 'Occipital lobe',
        detail: 'Primary and association visual cortex around the calcarine fissure. Infarct or trauma causes contralateral homonymous field defects; migraine aura may begin here. PCA territory in vascular teaching.'
    },
    '6': {
        title: 'Temporal lobe',
        legendLabel: 'Temporal lobe',
        detail: 'Auditory cortex on Heschl’s gyrus; Wernicke’s area (dominant) for language comprehension; medial structures (not fully seen laterally) support memory. Common site for complex partial seizures and MCA/PCA border-zone ischemia.'
    },
    '7': {
        title: 'Insula',
        legendLabel: 'Insula',
        detail: 'Deep to the opercula of frontal, parietal, and temporal lobes—interoception, taste, autonomic integration, and pain processing. Insular stroke can affect speech, swallowing, and autonomic stability.'
    },
    '8': {
        title: 'Cerebellum (hemisphere)',
        legendLabel: 'Cerebellum',
        detail: 'Coordination, balance, and fine motor timing for the ipsilateral side of the body. Mass lesion or stroke causes limb ataxia, dysmetria, and nystagmus; chronic alcohol exposure may show vermis/hemisphere atrophy.'
    },
    '9': {
        title: 'Midbrain',
        legendLabel: 'Midbrain',
        detail: 'Mesencephalon: CN III/IV nuclei, cerebral aqueduct vicinity, substantia nigra (Parkinson pathology), and corticospinal fibers in cerebral peduncles. Midbrain syndromes link vascular and herniation teaching.'
    },
    '10': {
        title: 'Pons',
        legendLabel: 'Pons',
        detail: 'Bridge between midbrain and medulla; cranial nerve nuclei V–VIII; long tracts and pontine centers for respiration. Basilar artery occlusion and central pontine myelinolysis are classic clinical correlates.'
    },
    '11': {
        title: 'Medulla oblongata',
        legendLabel: 'Medulla',
        detail: 'Cardiorespiratory and autonomic nuclei; CN IX–XII; corticospinal decussation. Lateral medullary (Wallenberg) syndrome demonstrates vertebral/PICA vascular anatomy and bulbar dysfunction.'
    },
    '12': {
        title: 'Lateral (Sylvian) fissure',
        legendLabel: 'Lateral fissure',
        detail: 'Deep groove between frontal/parietal operculum and temporal lobe—MCA runs in the Sylvian cistern. Landmark for lobar boundaries, aneurysm clipping corridors, and middle fossa mass effect patterns.'
    }
};

function brainDetailFromMeshName(rawName) {
    const n = rawName.toLowerCase().replace(/[_-]+/g, ' ');
    const disp = rawName.replace(/_/g, ' ').trim() || 'Brain region';
    const D = (title, legendLabel, detail) => ({ title, legendLabel, detail });
    const shortLegend = disp.length > 34 ? disp.slice(0, 32) + '…' : disp;

    const rules = [
        [/corpus callosum|\bcallosum\b/i, D('Corpus callosum', 'Corpus callosum', 'Major commissural white matter linking the cerebral hemispheres; midline lesions and agenesis show on MRI; split-brain research highlights interhemispheric transfer.')],
        [/hippocampus/, D('Hippocampus', 'Hippocampus', 'Medial temporal structure essential for memory consolidation; implicated in Alzheimer disease, mesial temporal sclerosis in epilepsy, and anoxic injury.')],
        [/amygdala/, D('Amygdala', 'Amygdala', 'Amygdaloid complex—emotion, fear conditioning, and autonomic integration; relevant in limbic encephalitis and anxiety physiology.')],
        [/thalamus\b/, D('Thalamus', 'Thalamus', 'Sensory relay and arousal hub; stroke or hemorrhage here causes sensory loss, altered consciousness, and language deficits depending on laterality and nucleus.')],
        [/hypothalamus/, D('Hypothalamus', 'Hypothalamus', 'Autonomic and endocrine control (HPA axis, thirst, temperature); links pituitary function—critical in neuroendocrine nursing and critical illness.')],
        [/cingulate|cingulum/, D('Cingulate region', 'Cingulate', 'Part of limbic circuitry around the corpus callosum; involved in mood, pain processing, and executive control; context for depression and chronic pain.')],
        [/insula|insular/, D('Insular cortex', 'Insula', 'Hidden lobe deep to sylvian fissure—interoception, taste, autonomic control; infarcts cause sensory, autonomic, and speech disturbances.')],
        [/olfactory|bulb/, D('Olfactory region', 'Olfactory', 'Smell pathway; trauma, meningiomas, or COVID-related anosmia teaching; cribriform plate fracture risk with basal skull injury.')],
        [/cerebell|cerebel\b/, D('Cerebellum', 'Cerebellum', 'Motor coordination, balance, and cognitive timing; stroke, tumor, or alcohol toxicity causes ataxia, nystagmus, and dysmetria.')],
        [/medulla oblongata|\bmedulla\b/, D('Medulla oblongata', 'Medulla', 'Cardiorespiratory and autonomic nuclei; lateral medullary (Wallenberg) syndrome illustrates brainstem vascular anatomy.')],
        [/\bpons\b|pontine/, D('Pons', 'Pons', 'Bridge housing corticospinal tracts and cranial nerve nuclei; central pontine myelinolysis tied to rapid sodium correction.')],
        [/midbrain|mesencephalon|tectum|tegmentum/, D('Midbrain', 'Midbrain', 'Contains CN III/IV nuclei, substantia nigra, and cerebral aqueduct vicinity; relevant to Parkinson disease and hydrocephalus pathways.')],
        [/brainstem|brain stem/, D('Brain stem', 'Brain stem', 'Midbrain, pons, and medulla—consciousness, vital reflexes, and ascending reticular formation; herniation syndromes threaten this compact area.')],
        [/spinal cord|pyramid\b|olive\b|inferior olive/, D('Brainstem / cord transition', 'Spinal–brainstem', 'Corticospinal decussation and inferior olive region; use with atlases for exact nuclear boundaries.')],
        [/putamen|caudate|globus pallidus|lentiform|striatum|basal ganglia/, D('Basal ganglia', 'Basal ganglia', 'Movement initiation and inhibition circuits; Parkinson (nigrostriatal), Huntington (caudate), and medication-induced movement disorders.')],
        [/subthalamic|substantia nigra/, D('Subthalamus / substantia nigra', 'Subthalamus / SN', 'Motor modulation; deep brain stimulation targets and dopaminergic neuron loss in Parkinson disease.')],
        [/frontal/, D('Frontal lobe / region', 'Frontal', 'Executive function, motor planning (precentral gyrus), personality; injury causes contralateral weakness, disinhibition, or expressive language deficits (dominant hemisphere).')],
        [/parietal|postcentral|somatosensory/, D('Parietal region', 'Parietal', 'Sensory integration, spatial attention; neglect syndromes with nondominant lesions, Gerstmann syndrome patterns with dominant inferior parietal injury.')],
        [/temporal(?! pole)|\bauditory\b|heschl|wernicke|fusiform/, D('Temporal lobe / region', 'Temporal', 'Memory (medial), auditory cortex, language comprehension on dominant side; common epileptogenic zone; MCA territory strokes.')],
        [/occipital|calcarine|visual cortex|striate/, D('Occipital / visual cortex', 'Occipital', 'Primary visual processing; stroke or trauma produces contralateral visual field cuts; migraine aura teaching.')],
        [/precentral|motor cortex|m1\b/, D('Primary motor cortex', 'Motor cortex', 'Upper motor neuron origin for voluntary movement; stroke here causes contralateral weakness with characteristic tone evolution.')],
        [/postcentral|somesthetic/, D('Primary sensory cortex', 'Sensory cortex', 'Discriminative touch and proprioception; sensory level mapping aids spinal cord lesion localization.')],
        [/fornix|mammillary|pituitary|hypophysis/, D('Diencephalon / sellar region', 'Diencephalon', 'Endocrine and limbic connections; pituitary apoplexy, craniopharyngioma, and DI/SIADH contexts in neuro nursing.')],
        [/claustrum|uncus|parahippocampal|entorhinal/, D('Medial temporal / limbic', 'Limbic (MTL)', 'Epilepsy surgery planning and memory circuits; uncinate herniation is a neurosurgical emergency sign.')],
        [/\bfma\b|bodyparts|bp3d|bp_\d/, D(rawName.replace(/_/g, ' '), shortLegend, 'Label follows BodyParts3D / Foundational Model of Anatomy style naming. Use an FMA or BodyParts3D lookup table to resolve the exact concept; clinically, relate the region to vascular territories and common deficit patterns.')]
    ];

    for (let i = 0; i < rules.length; i++) {
        if (rules[i][0].test(n)) return rules[i][1];
    }

    return D(disp, shortLegend,
        'This mesh is not tied to a numbered Somso-style callout. See brain/license.txt for the Sketchfab source (CC BY-NC). Cross-check the mesh name with your atlas or the 3D editor.');
}

/** Cheroske Sketchfab glTF: display callout 1–12 on regions Object_2 … Object_13 (texture numbers follow this order in the published model). */
function brainSketchfabAnnotationNumber(meshName) {
    const m = /^Object_(\d+)$/.exec(meshName);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    if (n < 2 || n > 13) return null;
    return n - 1;
}

function lungUmcgAnnotationNumber(organPartKey) {
    const m = /^umcg_hl_(\d+)$/.exec(organPartKey || '');
    return m ? parseInt(m[1], 10) : null;
}

/** Viewer-placed callouts 1–5 on the single-mesh Ginjal model (not from Sketchfab’s glTF export). */
function kidneyConceptAnnotationNumber(organPartKey) {
    const m = /^kid_ann_(\d+)$/.exec(organPartKey || '');
    return m ? parseInt(m[1], 10) : null;
}

function buildBrainMeshRuntimeFromGltf(model) {
    brainMeshDetailsRuntime = {};
    const used = new Set();
    model.traverse((child) => {
        if (!child.isMesh) return;
        let key = sanitizeBrainMeshKey(child.name);
        const base = key;
        let i = 2;
        while (used.has(key)) {
            key = base + '_' + i;
            i += 1;
        }
        used.add(key);
        child.userData.organPartKey = key;
        child.userData.structureName = child.name.replace(/_/g, ' ');
        const ann = brainSketchfabAnnotationNumber(child.name);
        let detail;
        if (ann != null && CHEROSKE_SOMSO_RIGHT_BRAIN_CALLOUTS[String(ann)]) {
            detail = Object.assign({}, CHEROSKE_SOMSO_RIGHT_BRAIN_CALLOUTS[String(ann)]);
        } else {
            detail = brainDetailFromMeshName(child.name);
        }
        if (ann != null) {
            detail.title = 'Region ' + ann + ' — ' + detail.title;
        }
        brainMeshDetailsRuntime[key] = detail;
    });
}

const MESH_LEGEND_META = {
    heart: {
        heading: 'Heart anatomy (8 structures)',
        note: 'Detailed cardiac model showing chambers, valves, and major vessels. Essential for cardiovascular assessment and understanding blood flow.',
        order: ['right_atrium', 'left_atrium', 'right_ventricle', 'left_ventricle', 'aorta', 'pulmonary_artery', 'superior_vena_cava', 'coronary_vessels']
    },
    lungs: {
        heading: 'Heart & lungs (7 regions)',
        note: 'Combined heart and lungs model showing pulmonary and cardiac structures. Numbered regions follow the blood-flow pathway through the cardiopulmonary system.',
        order: ['umcg_hl_1', 'umcg_hl_2', 'umcg_hl_3', 'umcg_hl_4', 'umcg_hl_5', 'umcg_hl_6', 'umcg_hl_7']
    },
    kidney: {
        heading: 'Kidney — numbered callouts',
        note: 'Kidney model with numbered callouts highlighting poles, lateral border, hilum, and outer surface. Toggle labels to show or hide.',
        order: ['kid_ann_1', 'kid_ann_2', 'kid_ann_3', 'kid_ann_4', 'kid_ann_5', 'concept_whole']
    },
    brain: {
        heading: 'Brain regions (per mesh)',
        note: 'Right hemisphere brain model showing 12 major regions. Click a numbered label or legend entry to highlight and learn about each structure.',
        order: null
    },
    syringe: {
        heading: 'Syringe components',
        note: 'Syringe model with components grouped by function. Click a 3D part or legend entry to highlight and view details.',
        order: ['barrel', 'flange', 'grips', 'graduations', 'plunger', 'luer', 'needle_hub', 'needle_shaft', 'bevel', 'medication', 'bubbles']
    },
    liver: {
        heading: 'Liver anatomy (8 structures)',
        note: 'Procedural model showing major hepatic structures. The liver is the largest solid organ, essential for metabolism, detoxification, and bile production.',
        order: ['right_lobe', 'left_lobe', 'caudate_lobe', 'quadrate_lobe', 'gallbladder', 'hepatic_artery', 'portal_vein', 'bile_duct']
    },
    stomach: {
        heading: 'Stomach anatomy (8 structures)',
        note: 'Procedural model of the stomach showing regions and features relevant to GI nursing assessment and pharmacology.',
        order: ['fundus', 'cardia', 'body', 'pylorus', 'greater_curvature', 'lesser_curvature', 'rugae', 'sphincter']
    },
    eye: {
        heading: 'Eye anatomy (8 structures)',
        note: 'Cross-sectional procedural model of the human eye. Key for ophthalmological assessment and neurological examination.',
        order: ['sclera', 'cornea', 'iris', 'pupil', 'lens', 'retina', 'optic_nerve', 'vitreous']
    },
    tooth: {
        heading: 'Tooth anatomy (8 structures)',
        note: 'Cross-sectional procedural model of a molar tooth showing crown-to-root layers relevant to oral health assessment.',
        order: ['crown', 'enamel', 'dentin', 'pulp', 'root_canal', 'root', 'cementum', 'gingiva']
    },
    spine: {
        heading: 'Vertebral anatomy (8 structures)',
        note: 'Procedural model of lumbar vertebrae with intervertebral disc. Landmarks for lumbar puncture and spinal assessment.',
        order: ['vertebral_body', 'disc', 'spinous_process', 'transverse_process', 'spinal_canal', 'pedicle', 'lamina', 'facet_joint']
    },
    skin: {
        heading: 'Skin layers & appendages (8 structures)',
        note: 'Cross-sectional procedural model of integumentary system. Relevant to wound assessment, injection technique, and dermatological nursing.',
        order: ['epidermis', 'dermis', 'hypodermis', 'hair_follicle', 'sweat_gland', 'sebaceous_gland', 'blood_vessel', 'nerve_ending']
    },
    skull: {
        heading: 'Skull bones (8 structures)',
        note: 'Human skull model showing major cranial and facial bones. Essential for neurological assessment and head trauma evaluation.',
        order: ['frontal_bone', 'parietal_bone', 'temporal_bone', 'occipital_bone', 'sphenoid_bone', 'mandible', 'maxilla', 'zygomatic_bone']
    },
    hip_joint: {
        heading: 'Hip joint anatomy (8 structures)',
        note: 'Ball-and-socket joint connecting femur to pelvis. Critical for mobility assessment and understanding hip fractures.',
        order: ['femoral_head', 'acetabulum', 'femoral_neck', 'greater_trochanter', 'labrum', 'joint_capsule', 'ligament_teres', 'ilium']
    },
    knee_joint: {
        heading: 'Knee joint anatomy (8 structures)',
        note: 'Largest synovial joint with complex ligament and meniscus structures. Key for musculoskeletal assessment.',
        order: ['femur_condyle', 'tibia_plateau', 'patella', 'acl', 'pcl', 'meniscus', 'mcl', 'lcl']
    },
    shoulder_joint: {
        heading: 'Shoulder joint anatomy (8 structures)',
        note: 'Most mobile joint in the body. Important for understanding dislocations and rotator cuff injuries.',
        order: ['humeral_head', 'glenoid', 'rotator_cuff', 'acromion', 'clavicle', 'labrum_shoulder', 'biceps_tendon', 'deltoid']
    },
    hand: {
        heading: 'Hand bones (8 structures)',
        note: 'Twenty-seven bones enabling complex grip and manipulation. Important for fracture identification and rehabilitation.',
        order: ['carpals', 'metacarpals', 'proximal_phalanx', 'middle_phalanx', 'distal_phalanx', 'scaphoid', 'lunate', 'thumb']
    },
    foot: {
        heading: 'Foot bones (8 structures)',
        note: 'Twenty-six bones supporting body weight and enabling locomotion. Essential for diabetic foot assessment.',
        order: ['calcaneus', 'talus', 'navicular', 'cuboid', 'metatarsals_foot', 'phalanges_foot', 'arch', 'cuneiforms']
    },
    pelvis: {
        heading: 'Pelvic anatomy (8 structures)',
        note: 'Bony ring supporting trunk and protecting pelvic organs. Critical for obstetric and orthopedic assessment.',
        order: ['ilium_pelvis', 'ischium', 'pubis', 'sacrum_pelvis', 'coccyx', 'acetabulum_pelvis', 'pubic_symphysis', 'pelvic_inlet']
    },
    muscular_system: {
        heading: 'Major muscles (8 structures)',
        note: 'Overview of skeletal muscles important for physical assessment, injection sites, and rehabilitation nursing.',
        order: ['pectoralis', 'biceps', 'quadriceps', 'deltoid_muscle', 'trapezius', 'abdominals', 'gastrocnemius', 'latissimus']
    },
    esophagus: {
        heading: 'Digestive system overview (6 structures)',
        note: 'Complete GI tract from esophagus to large intestine with accessory organs. Essential for GI assessment and nutrition support.',
        order: ['esophagus_tube', 'stomach_organ', 'liver_organ', 'gallbladder_organ', 'small_intestine_tract', 'large_intestine_tract']
    },
    small_intestine: {
        heading: 'Small intestine anatomy (8 structures)',
        note: 'Six-meter tube where most digestion and absorption occurs. Key for understanding malabsorption and enteral feeding.',
        order: ['duodenum', 'jejunum', 'ileum', 'villi', 'plicae_circulares', 'mesentery', 'ileocecal_valve', 'brunner_glands']
    },
    large_intestine: {
        heading: 'Large intestine anatomy (8 structures)',
        note: 'Absorbs water and electrolytes, forms feces. Essential for understanding colitis and ostomy care.',
        order: ['cecum', 'ascending_colon', 'transverse_colon', 'descending_colon', 'sigmoid_colon', 'rectum', 'appendix', 'anal_canal']
    },
    pancreas: {
        heading: 'Pancreas anatomy (8 structures)',
        note: 'Dual-function gland producing digestive enzymes and hormones. Critical for understanding diabetes and pancreatitis.',
        order: ['head_pancreas', 'body_pancreas', 'tail_pancreas', 'pancreatic_duct', 'islets_langerhans', 'uncinate_process', 'common_bile_duct_pancreas', 'ampulla_vater']
    },
    tongue: {
        heading: 'Tongue anatomy (8 structures)',
        note: 'Muscular organ for taste, speech, and swallowing. Important for oral assessment and cranial nerve examination.',
        order: ['dorsum', 'ventral_surface', 'taste_buds', 'frenulum', 'intrinsic_muscles', 'extrinsic_muscles', 'lingual_tonsil', 'papillae']
    },
    larynx: {
        heading: 'Larynx & trachea anatomy (8 structures)',
        note: 'Voice box and upper airway. Essential for airway management, intubation, and tracheostomy care.',
        order: ['epiglottis', 'thyroid_cartilage', 'cricoid_cartilage', 'vocal_cords', 'tracheal_rings', 'arytenoid', 'glottis', 'cricothyroid_membrane']
    },
    diaphragm: {
        heading: 'Diaphragm anatomy (8 structures)',
        note: 'Primary respiratory muscle separating thoracic and abdominal cavities. Key for breathing mechanics assessment.',
        order: ['central_tendon', 'right_crus', 'left_crus', 'aortic_hiatus', 'esophageal_hiatus', 'caval_opening', 'costal_part', 'sternal_part']
    },
    bladder: {
        heading: 'Urinary bladder anatomy (8 structures)',
        note: 'Hollow muscular organ storing urine. Essential for catheterization technique and urinary assessment.',
        order: ['detrusor', 'trigone', 'ureteral_orifice', 'internal_sphincter', 'external_sphincter', 'dome', 'neck', 'mucosa_bladder']
    },
    urinary_system: {
        heading: 'Urinary system anatomy (8 structures)',
        note: 'Complete urinary tract from kidneys to urethra. Fundamental for renal function and fluid balance assessment.',
        order: ['kidney_cortex', 'kidney_medulla', 'renal_pelvis', 'ureter', 'bladder_urinary', 'urethra', 'renal_artery', 'adrenal']
    },
    adrenal_gland: {
        heading: 'Adrenal gland anatomy (8 structures)',
        note: 'Endocrine glands producing cortisol, aldosterone, and adrenaline. Critical for stress response understanding.',
        order: ['zona_glomerulosa', 'zona_fasciculata', 'zona_reticularis', 'adrenal_medulla', 'cortex_outer', 'capsule_adrenal', 'adrenal_vein', 'chromaffin_cells']
    },
    male_reproductive: {
        heading: 'Male reproductive anatomy (8 structures)',
        note: 'System producing and delivering sperm and testosterone. Important for reproductive health assessment.',
        order: ['testis', 'epididymis', 'vas_deferens', 'seminal_vesicle', 'prostate', 'urethra_male', 'penis_structure', 'scrotum']
    },
    female_reproductive: {
        heading: 'Female reproductive anatomy (8 structures)',
        note: 'System supporting reproduction and fetal development. Essential for obstetric and gynecological assessment.',
        order: ['ovary', 'fallopian_tube', 'uterus_body', 'cervix', 'vagina', 'endometrium', 'myometrium', 'broad_ligament']
    },
    spinal_cord: {
        heading: 'Spinal cord anatomy (8 structures)',
        note: 'Central nervous tissue from medulla to L1-L2. Critical for neurological assessment and understanding spinal injury.',
        order: ['gray_matter', 'white_matter', 'dorsal_horn', 'ventral_horn', 'dorsal_root', 'ventral_root', 'meninges_cord', 'central_canal']
    },
    inner_ear: {
        heading: 'Inner ear anatomy (8 structures)',
        note: 'Contains cochlea for hearing and vestibular apparatus for balance. Important for vertigo assessment.',
        order: ['cochlea', 'vestibule', 'semicircular_canals', 'oval_window', 'round_window', 'organ_corti', 'auditory_nerve', 'endolymph']
    },
    thyroid: {
        heading: 'Thyroid gland anatomy (8 structures)',
        note: 'Butterfly-shaped endocrine gland regulating metabolism. Essential for thyroid disorder assessment.',
        order: ['right_lobe_thyroid', 'left_lobe_thyroid', 'isthmus', 'pyramidal_lobe', 'follicular_cells', 'parafollicular_cells', 'parathyroid', 'thyroid_vessels']
    },
    pituitary: {
        heading: 'Pituitary & limbic system anatomy (8 structures)',
        note: 'Hypothalamic-pituitary complex shown in limbic system context. Key for understanding endocrine and stress axis.',
        order: ['hypothalamus_pituitary', 'optic_chiasm_pit', 'thalamus', 'mammillary_bodies', 'hippocampus', 'amygdala', 'pineal_gland', 'brain_stem_pit']
    },
    lymph_node: {
        heading: 'Lymph node anatomy (8 structures)',
        note: 'Bean-shaped immune organs filtering lymph. Important for infection assessment and cancer staging.',
        order: ['cortex_lymph', 'paracortex', 'medulla_lymph', 'germinal_center', 'afferent_vessel', 'efferent_vessel', 'hilum_lymph', 'capsule_lymph']
    },
    ear: {
        heading: 'Ear anatomy (8 structures)',
        note: 'Organ of hearing and balance with external, middle, and inner ear. Essential for otoscopic examination.',
        order: ['pinna', 'ear_canal', 'tympanic_membrane', 'malleus', 'incus', 'stapes', 'eustachian_tube', 'mastoid']
    },
    blood_cells: {
        heading: 'Blood cell types (8 structures)',
        note: 'Cellular components of blood. Fundamental for CBC interpretation and understanding hematological disorders.',
        order: ['rbc', 'neutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil', 'platelet', 'plasma']
    },
    human_cell: {
        heading: 'Cell organelles (8 structures)',
        note: 'Basic structural and functional unit of life. Foundation for understanding pathology and pharmacology.',
        order: ['nucleus', 'mitochondria', 'endoplasmic_reticulum', 'golgi_apparatus', 'cell_membrane', 'ribosome', 'lysosome', 'cytoplasm']
    },
    dna: {
        heading: 'DNA structure (8 components)',
        note: 'Double helix molecule carrying genetic instructions. Essential for genetics and pharmacogenomics understanding.',
        order: ['double_helix', 'base_pairs', 'sugar_phosphate', 'adenine', 'thymine', 'guanine', 'cytosine', 'hydrogen_bonds']
    },
    iv_setup: {
        heading: 'IV setup components (8 parts)',
        note: 'Intravenous therapy equipment for fluid and medication delivery. Fundamental nursing skill.',
        order: ['iv_bag', 'drip_chamber', 'roller_clamp', 'tubing', 'y_port', 'cannula', 'flow_regulator', 'spike']
    },
    catheter: {
        heading: 'Urinary catheter components (8 parts)',
        note: 'Flexible tube inserted into bladder for urine drainage. Essential nursing procedure.',
        order: ['catheter_tip', 'balloon', 'drainage_lumen', 'inflation_lumen', 'drainage_port', 'balloon_port', 'catheter_shaft', 'collection_bag']
    },
    gallbladder_organ: {
        heading: 'Gallbladder anatomy (8 structures)',
        note: 'Pear-shaped organ storing bile. Important for understanding biliary disease and cholecystectomy nursing.',
        order: ['gb_fundus', 'gb_body', 'gb_neck', 'cystic_duct', 'gb_mucosa', 'gb_serosa', 'hepatic_surface', 'gb_artery']
    },
    neuron: {
        heading: 'Neuron anatomy (8 structures)',
        note: 'Fundamental unit of the nervous system. Essential for understanding nerve conduction, synaptic transmission, and neurological drug mechanisms.',
        order: ['soma', 'dendrites', 'axon_hillock', 'axon', 'myelin_sheath', 'nodes_ranvier', 'axon_terminal', 'synapse']
    }
};

function getMeshDetailsMap(modelId) {
    if (modelId === 'brain') {
        return brainMeshDetailsRuntime;
    }
    if (modelId === 'lungs') {
        return lungMeshDetailsRuntime;
    }
    const maps = {
        heart: HEART_MESH_DETAILS,
        kidney: KIDNEY_MESH_DETAILS,
        syringe: SYRINGE_MESH_DETAILS,
        liver: LIVER_MESH_DETAILS,
        stomach: STOMACH_MESH_DETAILS,
        eye: EYE_MESH_DETAILS,
        tooth: TOOTH_MESH_DETAILS,
        spine: SPINE_MESH_DETAILS,
        skin: SKIN_MESH_DETAILS,
        skull: SKULL_MESH_DETAILS,
        hip_joint: HIP_JOINT_MESH_DETAILS,
        knee_joint: KNEE_JOINT_MESH_DETAILS,
        shoulder_joint: SHOULDER_JOINT_MESH_DETAILS,
        hand: HAND_MESH_DETAILS,
        foot: FOOT_MESH_DETAILS,
        pelvis: PELVIS_MESH_DETAILS,
        muscular_system: MUSCULAR_SYSTEM_MESH_DETAILS,
        esophagus: DIGESTIVE_SYSTEM_MESH_DETAILS,
        small_intestine: SMALL_INTESTINE_MESH_DETAILS,
        large_intestine: LARGE_INTESTINE_MESH_DETAILS,
        pancreas: PANCREAS_MESH_DETAILS,
        tongue: TONGUE_MESH_DETAILS,
        larynx: LARYNX_MESH_DETAILS,
        diaphragm: DIAPHRAGM_MESH_DETAILS,
        bladder: BLADDER_MESH_DETAILS,
        urinary_system: URINARY_SYSTEM_MESH_DETAILS,
        adrenal_gland: ADRENAL_GLAND_MESH_DETAILS,
        male_reproductive: MALE_REPRODUCTIVE_MESH_DETAILS,
        female_reproductive: FEMALE_REPRODUCTIVE_MESH_DETAILS,
        spinal_cord: SPINAL_CORD_MESH_DETAILS,
        inner_ear: INNER_EAR_MESH_DETAILS,
        thyroid: THYROID_MESH_DETAILS,
        pituitary: PITUITARY_MESH_DETAILS,
        lymph_node: LYMPH_NODE_MESH_DETAILS,
        ear: EAR_MESH_DETAILS,
        blood_cells: BLOOD_CELLS_MESH_DETAILS,
        human_cell: HUMAN_CELL_MESH_DETAILS,
        dna: DNA_MESH_DETAILS,
        iv_setup: IV_SETUP_MESH_DETAILS,
        catheter: CATHETER_MESH_DETAILS,
        neuron: NEURON_MESH_DETAILS,
        gallbladder_organ: GALLBLADDER_ORGAN_MESH_DETAILS
    };
    return maps[modelId] || null;
}

function meshLegendKeys(modelId) {
    const map = getMeshDetailsMap(modelId);
    if (!map) return [];
    const meta = MESH_LEGEND_META[modelId];
    if (meta && meta.order) return meta.order.filter((k) => map[k]);
    if (modelId === 'heart') {
        return Object.keys(map).sort((a, b) => Number(a) - Number(b));
    }
    if (modelId === 'brain') {
        return Object.keys(map).sort((a, b) => {
            const ma = /^Object_(\d+)$/.exec(a);
            const mb = /^Object_(\d+)$/.exec(b);
            if (ma && mb) return Number(ma[1]) - Number(mb[1]);
            return a.localeCompare(b, undefined, { sensitivity: 'base' });
        });
    }
    return Object.keys(map);
}

// Initialize Three.js scene
