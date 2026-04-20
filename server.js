const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get local network IP address
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost'; // Fallback if no network interface found
}

const LOCAL_IP = getLocalIPAddress();
// In production use PUBLIC_URL env var or the known Render hostname.
// Locally fall back to the LAN IP so phones on the same Wi-Fi can connect.
const BASE_URL = process.env.PUBLIC_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://ar-nursing-module.onrender.com'
        : `http://${LOCAL_IP}:${PORT}`);

// Serve static files
// - JS/CSS/GLTF: no-cache so browsers always revalidate.
//   .gltf files are JSON manifests that reference other assets and CAN change
//   between deploys at the same URL (e.g. texture format updates). They must
//   not be cached immutably.
// - GLB/BIN/textures: cache for 7 days with immutable.
//   These are large binaries whose URL does not change when their content
//   changes (textures co-exist alongside originals), so 7-day immutable is safe.
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders(res, filePath) {
        if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.gltf')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else if (
            filePath.endsWith('.glb') || filePath.endsWith('.bin') ||
            filePath.endsWith('.png') || filePath.endsWith('.jpg') ||
            filePath.endsWith('.jpeg') || filePath.endsWith('.webp') ||
            filePath.endsWith('.ktx2') || filePath.endsWith('.basis')
        ) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        }
    }
}));

// API endpoint to generate QR codes
app.get('/api/qrcode/:organ', async (req, res) => {
    const organ = req.params.organ;
    // Always use the local IP for QR codes so phones can access it
    const arUrl = `${BASE_URL}/ar-viewer.html?model=${organ}`;

    try {
        const qrDataUrl = await QRCode.toDataURL(arUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#1a1a2e',
                light: '#ffffff'
            }
        });
        res.json({ qrCode: qrDataUrl, url: arUrl });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// API endpoint to get all available models (head-to-toe anatomical order)
app.get('/api/models', (req, res) => {
    const models = [
        // === HEAD ===
        {
            id: 'skull',
            name: 'Human Skull',
            description: 'The bony framework of the head consisting of cranial and facial bones that protect the brain and support facial structures.',
            clinicalRelevance: 'Essential for neurological assessment, head trauma evaluation, fontanelle assessment in neonates, and understanding intracranial pressure.',
            keyStructures: ['Frontal Bone', 'Parietal Bone', 'Temporal Bone', 'Occipital Bone', 'Mandible', 'Zygomatic Bone']
        },
        {
            id: 'brain',
            name: 'Human Brain',
            description: 'The brain is the central organ of the nervous system controlling all body functions.',
            clinicalRelevance: 'Essential for neurological assessment, understanding stroke symptoms, and cognitive function evaluation.',
            keyStructures: ['Cerebrum', 'Cerebellum', 'Brain Stem', 'Frontal Lobe', 'Temporal Lobe', 'Occipital Lobe']
        },
        {
            id: 'eye',
            name: 'Human Eye',
            description: 'The eye is the sensory organ for vision, converting light into neural signals processed by the brain.',
            clinicalRelevance: 'Critical for neurological assessment (pupil reflexes), ophthalmoscopy, and conditions like glaucoma and diabetic retinopathy.',
            keyStructures: ['Sclera', 'Cornea', 'Iris', 'Pupil', 'Lens', 'Retina', 'Optic Nerve']
        },
        {
            id: 'tooth',
            name: 'Human Tooth',
            description: 'Teeth are calcified structures in the oral cavity used for mastication. Each tooth has a crown, neck, and root.',
            clinicalRelevance: 'Important for oral health assessment, understanding dental caries, periodontal disease, and oral hygiene education.',
            keyStructures: ['Enamel', 'Dentin', 'Pulp Chamber', 'Root Canal', 'Crown', 'Root']
        },
        {
            id: 'ear',
            name: 'Human Ear',
            description: 'The organ of hearing and balance comprising the external ear (pinna and canal), middle ear (ossicles), and inner ear structures.',
            clinicalRelevance: 'Essential for otoscopic examination, understanding otitis media, hearing loss assessment, and ear irrigation techniques.',
            keyStructures: ['Pinna (Auricle)', 'Ear Canal', 'Tympanic Membrane', 'Malleus', 'Stapes', 'Eustachian Tube']
        },
        {
            id: 'inner_ear',
            name: 'Inner Ear',
            description: 'The deepest part of the ear containing the cochlea for hearing and the vestibular apparatus for balance and spatial orientation.',
            clinicalRelevance: 'Important for understanding sensorineural hearing loss, vertigo (BPPV, Meniere\'s disease), and vestibular assessment.',
            keyStructures: ['Cochlea', 'Vestibule', 'Semicircular Canals', 'Oval Window', 'Organ of Corti', 'Auditory Nerve']
        },
        // === NECK ===
        {
            id: 'larynx',
            name: 'Larynx & Trachea',
            description: 'The voice box and upper airway structures responsible for phonation, airway protection during swallowing, and conducting air to the lungs.',
            clinicalRelevance: 'Essential for airway management, intubation technique, tracheostomy care, and understanding airway obstruction emergencies.',
            keyStructures: ['Epiglottis', 'Thyroid Cartilage', 'Cricoid Cartilage', 'Vocal Cords', 'Tracheal Rings', 'Glottis']
        },
        {
            id: 'thyroid',
            name: 'Thyroid Gland',
            description: 'A butterfly-shaped endocrine gland in the neck that produces T3 and T4 hormones regulating metabolism.',
            clinicalRelevance: 'Essential for thyroid disorder assessment, thyroidectomy nursing care, and understanding hypo/hyperthyroidism.',
            keyStructures: ['Right Lobe', 'Left Lobe', 'Isthmus', 'Follicular Cells', 'C-Cells', 'Parathyroid']
        },
        {
            id: 'tongue',
            name: 'Human Tongue',
            description: 'A muscular organ in the oral cavity essential for taste, speech, mastication, and swallowing.',
            clinicalRelevance: 'Important for oral assessment, cranial nerve testing (CN VII, IX, XII), sublingual medication administration, and swallowing evaluation.',
            keyStructures: ['Dorsum', 'Ventral Surface', 'Taste Buds', 'Frenulum', 'Papillae', 'Lingual Tonsil']
        },
        {
            id: 'esophagus',
            name: 'Digestive System',
            description: 'Complete overview of the gastrointestinal tract from esophagus to large intestine, including accessory organs like the liver and gallbladder.',
            clinicalRelevance: 'Essential for GI assessment, nutrition support, NG/OG tube placement, understanding abdominal pathology, and enteral feeding.',
            keyStructures: ['Esophagus', 'Stomach', 'Liver', 'Small Intestine', 'Large Intestine', 'Gallbladder']
        },
        {
            id: 'pituitary',
            name: 'Pituitary Gland',
            description: 'The hypothalamic-pituitary complex shown within the limbic system, illustrating its connections to the thalamus, hippocampus, amygdala, and brain stem.',
            clinicalRelevance: 'Critical for understanding hormonal disorders, diabetes insipidus, pituitary adenomas, the HPA stress axis, and limbic system connections in critical illness.',
            keyStructures: ['Hypothalamus & Pituitary', 'Optic Chiasm', 'Thalamus', 'Mammillary Bodies', 'Hippocampus', 'Amygdala']
        },
        // === UPPER EXTREMITY ===
        {
            id: 'shoulder_joint',
            name: 'Shoulder Joint',
            description: 'The most mobile joint in the body, a ball-and-socket joint between the humeral head and the shallow glenoid fossa.',
            clinicalRelevance: 'Important for understanding dislocations, rotator cuff injuries, frozen shoulder, and deltoid injection technique.',
            keyStructures: ['Humeral Head', 'Glenoid Fossa', 'Rotator Cuff', 'Acromion', 'Clavicle', 'Deltoid']
        },
        // === THORAX ===
        {
            id: 'heart',
            name: 'Human Heart',
            description: 'The heart is a muscular organ that pumps blood through the circulatory system.',
            clinicalRelevance: 'Essential for cardiac assessment, auscultation points, and understanding cardiovascular conditions.',
            keyStructures: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle', 'Aorta', 'Pulmonary Artery', 'Superior Vena Cava', 'Coronary Vessels']
        },
        {
            id: 'lungs',
            name: 'Heart & lungs',
            description: 'Combined thoracic model: pulmonary circulation and bilateral lungs (E-learning UMCG "Healthy heart and lungs", CC BY-NC-SA).',
            clinicalRelevance: 'Links gas exchange, right- and left-heart flow, and pulmonary/systemic circulation for cardiopulmonary teaching.',
            keyStructures: ['Trachea', 'Bronchi', 'Bronchioles', 'Alveoli', 'Pleura', 'Diaphragm']
        },
        {
            id: 'diaphragm',
            name: 'Diaphragm',
            description: 'The primary muscle of respiration, a dome-shaped musculotendinous partition separating the thoracic and abdominal cavities.',
            clinicalRelevance: 'Essential for understanding breathing mechanics, hiatal hernia, diaphragmatic paralysis assessment, and mechanical ventilation concepts.',
            keyStructures: ['Central Tendon', 'Right Crus', 'Left Crus', 'Aortic Hiatus', 'Esophageal Hiatus', 'Caval Opening']
        },
        // === SPINE & CORD ===
        {
            id: 'spine',
            name: 'Vertebral Spine',
            description: 'The vertebral column protects the spinal cord and provides structural support. Each vertebra has a body, arch, and processes.',
            clinicalRelevance: 'Essential for spinal assessment, lumbar puncture technique, understanding disc herniation, and back injury management.',
            keyStructures: ['Vertebral Body', 'Intervertebral Disc', 'Spinous Process', 'Spinal Canal', 'Pedicle', 'Facet Joint']
        },
        {
            id: 'spinal_cord',
            name: 'Spinal Cord',
            description: 'The central nervous system structure extending from the medulla oblongata to L1-L2, carrying motor and sensory pathways.',
            clinicalRelevance: 'Critical for neurological assessment, understanding spinal cord injury levels, epidural anesthesia, and reflex testing.',
            keyStructures: ['Gray Matter', 'White Matter', 'Dorsal Horn', 'Ventral Horn', 'Dorsal Root', 'Meninges']
        },
        // === ABDOMEN ===
        {
            id: 'liver',
            name: 'Human Liver',
            description: 'The liver is the largest solid organ, responsible for metabolism, detoxification, bile production, and protein synthesis.',
            clinicalRelevance: 'Essential for understanding hepatobiliary assessment, drug metabolism, liver function tests, and conditions like cirrhosis and hepatitis.',
            keyStructures: ['Right Lobe', 'Left Lobe', 'Caudate Lobe', 'Gallbladder', 'Portal Vein', 'Hepatic Artery']
        },
        {
            id: 'stomach',
            name: 'Human Stomach',
            description: 'A muscular hollow organ of the GI tract that receives food from the esophagus and begins chemical and mechanical digestion.',
            clinicalRelevance: 'Key for GI assessment, understanding peptic ulcer disease, GERD, gastric medications, and NG tube placement.',
            keyStructures: ['Fundus', 'Body', 'Pylorus', 'Cardia', 'Greater Curvature', 'Lesser Curvature']
        },
        {
            id: 'pancreas',
            name: 'Pancreas',
            description: 'A dual-function gland producing digestive enzymes (exocrine) and hormones including insulin and glucagon (endocrine).',
            clinicalRelevance: 'Critical for understanding diabetes mellitus, acute/chronic pancreatitis, and pancreatic cancer management.',
            keyStructures: ['Head', 'Body', 'Tail', 'Pancreatic Duct', 'Islets of Langerhans', 'Ampulla of Vater']
        },
        {
            id: 'gallbladder_organ',
            name: 'Gallbladder',
            description: 'A pear-shaped sac on the inferior surface of the liver that stores and concentrates bile for fat digestion in the duodenum.',
            clinicalRelevance: 'Important for understanding biliary colic, cholecystitis (Murphy\'s sign), gallstone disease, and cholecystectomy nursing care.',
            keyStructures: ['Fundus', 'Body', 'Neck', 'Cystic Duct', 'Mucosa', 'Cystic Artery']
        },
        {
            id: 'kidney',
            name: 'Human Kidney',
            description: '3D orientation model ("3D Ginjal Concept", Sketchfab, CC BY 4.0 by siskahidayati). The kidneys filter blood, remove waste, and regulate fluid balance.',
            clinicalRelevance: 'Use for renal anatomy orientation alongside texts or layered models for cortex, medulla, vessels, and collecting system.',
            keyStructures: ['Kidney (concept model)', 'Structure']
        },
        {
            id: 'adrenal_gland',
            name: 'Adrenal Gland',
            description: 'Paired endocrine glands atop the kidneys with an outer cortex producing steroid hormones and an inner medulla producing catecholamines.',
            clinicalRelevance: 'Critical for understanding Addison\'s disease, Cushing\'s syndrome, pheochromocytoma, and the stress response in critical care.',
            keyStructures: ['Zona Glomerulosa', 'Zona Fasciculata', 'Zona Reticularis', 'Medulla', 'Cortex', 'Chromaffin Cells']
        },
        {
            id: 'small_intestine',
            name: 'Small Intestine',
            description: 'A six-metre tube where most chemical digestion and nutrient absorption occurs, divided into duodenum, jejunum, and ileum.',
            clinicalRelevance: 'Key for understanding malabsorption syndromes, Crohn\'s disease, enteral feeding, and duodenal ulcer management.',
            keyStructures: ['Duodenum', 'Jejunum', 'Ileum', 'Villi', 'Plicae Circulares', 'Mesentery']
        },
        {
            id: 'large_intestine',
            name: 'Large Intestine',
            description: 'The terminal portion of the GI tract responsible for water and electrolyte absorption and feces formation.',
            clinicalRelevance: 'Essential for understanding colitis, diverticular disease, colorectal cancer screening, and ostomy care.',
            keyStructures: ['Cecum', 'Ascending Colon', 'Transverse Colon', 'Descending Colon', 'Sigmoid Colon', 'Rectum']
        },
        // === PELVIS ===
        {
            id: 'bladder',
            name: 'Urinary Bladder',
            description: 'A hollow muscular organ that stores urine produced by the kidneys before excretion via the urethra.',
            clinicalRelevance: 'Essential for catheterization technique, urinary retention assessment, incontinence management, and bladder cancer screening.',
            keyStructures: ['Detrusor Muscle', 'Trigone', 'Ureteral Orifice', 'Internal Sphincter', 'External Sphincter', 'Dome']
        },
        {
            id: 'urinary_system',
            name: 'Urinary System',
            description: 'The complete urinary tract comprising kidneys, ureters, bladder, and urethra, responsible for blood filtration, urine formation, and fluid balance.',
            clinicalRelevance: 'Fundamental for renal function assessment, fluid and electrolyte balance, catheterization, and understanding acute kidney injury.',
            keyStructures: ['Renal Cortex', 'Renal Medulla', 'Ureter', 'Bladder', 'Urethra', 'Renal Artery']
        },
        {
            id: 'male_reproductive',
            name: 'Male Reproductive System',
            description: 'The system of organs responsible for producing, storing, and delivering sperm, and producing testosterone.',
            clinicalRelevance: 'Important for reproductive health assessment, testicular self-examination, prostate screening, catheterization considerations, and STI education.',
            keyStructures: ['Testis', 'Epididymis', 'Vas Deferens', 'Prostate', 'Seminal Vesicle', 'Scrotum']
        },
        {
            id: 'female_reproductive',
            name: 'Female Reproductive System',
            description: 'The system of organs supporting ovulation, fertilization, fetal development, and childbirth, regulated by cyclical hormonal changes.',
            clinicalRelevance: 'Essential for obstetric assessment, cervical screening, understanding labor stages, and gynecological conditions management.',
            keyStructures: ['Ovary', 'Fallopian Tube', 'Uterus', 'Cervix', 'Endometrium', 'Myometrium']
        },
        {
            id: 'pelvis',
            name: 'Pelvis',
            description: 'The bony ring formed by the hip bones, sacrum, and coccyx, supporting the trunk, protecting pelvic organs, and transmitting body weight to the lower limbs.',
            clinicalRelevance: 'Critical for obstetric pelvimetry, understanding pelvic fractures, bone marrow biopsy landmarks, and surgical anatomy.',
            keyStructures: ['Ilium', 'Ischium', 'Pubis', 'Sacrum', 'Acetabulum', 'Pubic Symphysis']
        },
        {
            id: 'hip_joint',
            name: 'Hip Joint',
            description: 'A ball-and-socket synovial joint connecting the femoral head to the pelvic acetabulum, bearing body weight.',
            clinicalRelevance: 'Essential for understanding hip fractures in elderly, joint replacement nursing, and intramuscular injection landmarks.',
            keyStructures: ['Femoral Head', 'Acetabulum', 'Femoral Neck', 'Greater Trochanter', 'Labrum', 'Joint Capsule']
        },
        // === LOWER EXTREMITY ===
        {
            id: 'knee_joint',
            name: 'Knee Joint',
            description: 'The largest synovial joint in the body, a modified hinge joint with complex ligamentous and meniscal structures.',
            clinicalRelevance: 'Key for musculoskeletal assessment, understanding ACL/meniscus injuries, joint replacement nursing, and patellar reflex testing.',
            keyStructures: ['Femoral Condyle', 'Tibial Plateau', 'Patella', 'ACL', 'Meniscus', 'MCL']
        },
        {
            id: 'hand',
            name: 'Human Hand',
            description: 'A complex structure of 27 bones including carpals, metacarpals, and phalanges, enabling grip, manipulation, and fine motor skills.',
            clinicalRelevance: 'Important for fracture identification (scaphoid, boxer\'s), rheumatoid arthritis assessment, and hand function rehabilitation.',
            keyStructures: ['Carpals', 'Metacarpals', 'Proximal Phalanx', 'Distal Phalanx', 'Scaphoid', 'Thumb']
        },
        {
            id: 'foot',
            name: 'Human Foot',
            description: 'A complex structure of 26 bones supporting body weight and enabling locomotion, with medial and lateral arches for shock absorption.',
            clinicalRelevance: 'Essential for diabetic foot assessment, gait analysis, understanding plantar fasciitis, and fracture identification.',
            keyStructures: ['Calcaneus', 'Talus', 'Metatarsals', 'Phalanges', 'Medial Arch', 'Cuneiforms']
        },
        {
            id: 'muscular_system',
            name: 'Muscular System',
            description: 'The skeletal muscle system enabling voluntary movement, posture maintenance, and heat generation, comprising over 600 muscles.',
            clinicalRelevance: 'Important for physical assessment, intramuscular injection site selection, understanding neuromuscular disorders, and rehabilitation planning.',
            keyStructures: ['Pectoralis', 'Biceps', 'Quadriceps', 'Deltoid', 'Trapezius', 'Gastrocnemius']
        },
        // === INTEGUMENTARY ===
        {
            id: 'skin',
            name: 'Human Skin',
            description: 'The integumentary system is the body\'s largest organ, providing protection, thermoregulation, and sensation.',
            clinicalRelevance: 'Fundamental for wound assessment, burn classification, injection technique, skin integrity monitoring, and dermatological conditions.',
            keyStructures: ['Epidermis', 'Dermis', 'Hypodermis', 'Hair Follicle', 'Sweat Gland', 'Sebaceous Gland']
        },
        // === CELLULAR / MICROSCOPIC ===
        {
            id: 'neuron',
            name: 'Neuron',
            description: 'The fundamental functional unit of the nervous system, transmitting electrical and chemical signals between the brain, spinal cord, and body.',
            clinicalRelevance: 'Critical for understanding nerve conduction, neurodegenerative diseases, synaptic transmission, and the mechanism of action of neurological medications.',
            keyStructures: ['Cell Body (Soma)', 'Dendrites', 'Axon', 'Myelin Sheath', 'Nodes of Ranvier', 'Axon Terminal']
        },
        {
            id: 'blood_cells',
            name: 'Blood Cells',
            description: 'The cellular components of blood including erythrocytes, leukocytes, and platelets, each with specialized roles in oxygen transport, immunity, and hemostasis.',
            clinicalRelevance: 'Fundamental for CBC interpretation, understanding anemia, infection response (left shift), thrombocytopenia, and leukemia.',
            keyStructures: ['Red Blood Cell', 'Neutrophil', 'Lymphocyte', 'Monocyte', 'Platelet', 'Plasma']
        },
        {
            id: 'human_cell',
            name: 'Human Cell',
            description: 'The basic structural and functional unit of all living organisms, containing organelles that perform essential life processes.',
            clinicalRelevance: 'Foundation for understanding pathology, pharmacology (drug targets at cellular level), cancer biology, and genetic disorders.',
            keyStructures: ['Nucleus', 'Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Cell Membrane', 'Ribosome']
        },
        {
            id: 'dna',
            name: 'DNA Structure',
            description: 'Deoxyribonucleic acid, the double-helix molecule carrying genetic instructions for development, functioning, and reproduction of all living organisms.',
            clinicalRelevance: 'Essential for understanding genetics, pharmacogenomics, cancer mutations, genetic testing, and gene therapy concepts.',
            keyStructures: ['Double Helix', 'Base Pairs', 'Adenine', 'Thymine', 'Guanine', 'Cytosine']
        },
        {
            id: 'lymph_node',
            name: 'Lymph Node',
            description: 'Small bean-shaped immune organs that filter lymph fluid, trapping pathogens and cancer cells while activating immune responses.',
            clinicalRelevance: 'Important for infection assessment, lymphadenopathy evaluation, cancer staging (sentinel node biopsy), and understanding immune response.',
            keyStructures: ['Cortex', 'Paracortex', 'Germinal Center', 'Afferent Vessel', 'Efferent Vessel', 'Hilum']
        },
        // === MEDICAL EQUIPMENT ===
        {
            id: 'syringe',
            name: 'Medical Syringe',
            description: 'A medical device used to inject fluids or withdraw body fluids.',
            clinicalRelevance: 'Fundamental for medication administration, blood sampling, and injection techniques.',
            keyStructures: ['Barrel', 'Plunger', 'Needle Hub', 'Needle Shaft', 'Bevel', 'Graduation Marks']
        },
        {
            id: 'iv_setup',
            name: 'IV Setup',
            description: 'Intravenous therapy equipment used for fluid replacement, medication administration, and blood product transfusion.',
            clinicalRelevance: 'Fundamental nursing skill for medication administration, fluid resuscitation, calculating drip rates, and preventing complications like air embolism.',
            keyStructures: ['IV Bag', 'Drip Chamber', 'Roller Clamp', 'Tubing', 'Cannula', 'Flow Regulator']
        },
        {
            id: 'catheter',
            name: 'Urinary Catheter',
            description: 'A flexible tube inserted into the bladder through the urethra for urine drainage, with retention balloon and multiple lumens.',
            clinicalRelevance: 'Essential nursing procedure for urinary retention management, I&O monitoring, and understanding CAUTI prevention bundles.',
            keyStructures: ['Catheter Tip', 'Retention Balloon', 'Drainage Lumen', 'Inflation Lumen', 'Drainage Port', 'Collection Bag']
        }
    ];
    res.json(models);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     AR Nursing Clinical Skills Learning Module                ║
║     Server running at http://localhost:${PORT}                   ║
║     Network access: http://${LOCAL_IP}:${PORT}                      ║
╠═══════════════════════════════════════════════════════════════╣
║  Pages:                                                       ║
║  • Home/Handbook:    http://localhost:${PORT}                    ║
║  • AR Viewer:        http://localhost:${PORT}/ar-viewer.html     ║
║  • Print Handbook:   http://localhost:${PORT}/handbook.html      ║
║                                                               ║
║  📱 For Mobile Devices (same WiFi):                          ║
║  • Home:             http://${LOCAL_IP}:${PORT}                      ║
║  • AR Viewer:        http://${LOCAL_IP}:${PORT}/ar-viewer.html     ║
╚═══════════════════════════════════════════════════════════════╝
    `);
});
