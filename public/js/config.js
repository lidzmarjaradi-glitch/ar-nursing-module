// ═══════════════════════════════════════════════════════
// config.js — Model configuration & emoji mapping
// ═══════════════════════════════════════════════════════
//
// MODEL CONFIG PROPERTIES
// ───────────────────────
// type:           'external' (glTF), 'stl', or 'procedural'
// path:           URL path to the model file (external/stl only)
// scale:          optional manual scale override
// partLegend:     set to false to suppress the parts legend panel
// annotationPath: 'custom' for models with model-specific annotation
//                 logic (heart, lungs, kidney, brain, syringe, neuron).
//                 Omit for standard mesh-based or approximate mapping.
//

// Model configuration - set to 'external' for downloaded models, 'procedural' for generated
const modelConfig = {
    // Hannah Newey–style Sketchfab heart: needs scene.bin beside scene.gltf. Fallback STL: heart.stl + type 'stl', scale ~0.02–0.04.
    heart: { type: 'external', path: '/models/heart/scene_draco.glb', scale: 1.5, annotationPath: 'custom' },
    // UMCG heart+lungs: scene.bin beside scene.gltf. Root node is already ~0.007 scale — we auto-fit to ~4 units in loadExternalModel (do not use a tiny manual scale).
    lungs: { type: 'external', path: '/models/lungs/scene_draco.glb', annotationPath: 'custom' },
    // siskahidayati "3D Ginjal Concept" (Sketchfab, CC BY 4.0) — single mesh; scene.bin + textures/ in /models/kidney/
    kidney: { type: 'external', path: '/models/kidney/scene_draco.glb', annotationPath: 'custom' },
    // Cheroske right-hemisphere brain: native coords are large; increase/decrease scale if framing is off.
    brain: { type: 'external', path: '/models/brain/scene_draco.glb', scale: 0.012, annotationPath: 'custom' },
    syringe: { type: 'procedural', annotationPath: 'custom' },
    liver: { type: 'external', path: '/models/liver/scene.gltf' },
    stomach: { type: 'external', path: '/models/stomach/scene_draco.glb' },
    eye: { type: 'external', path: '/models/eye/scene.gltf' },
    tooth: { type: 'external', path: '/models/tooth/scene.gltf' },
    spine: { type: 'external', path: '/models/spine/scene_draco.glb' },
    skin: { type: 'external', path: '/models/skin/scene_draco.glb' },
    skull: { type: 'external', path: '/models/skull/scene_draco.glb' },
    hip_joint: { type: 'external', path: '/models/hip_joint/scene_draco.glb' },
    knee_joint: { type: 'external', path: '/models/knee_joint/scene.gltf' },
    shoulder_joint: { type: 'external', path: '/models/shoulder_joint/scene.gltf' },
    hand: { type: 'external', path: '/models/hand/scene_draco.glb' },
    foot: { type: 'external', path: '/models/foot/scene_draco.glb' },
    pelvis: { type: 'external', path: '/models/pelvis/scene_draco.glb' },
    muscular_system: { type: 'external', path: '/models/muscular_system/scene.gltf' },
    esophagus: { type: 'external', path: '/models/esophagus/scene.gltf' },
    small_intestine: { type: 'external', path: '/models/small_intestine/scene_draco.glb' },
    large_intestine: { type: 'external', path: '/models/large_intestine/scene_draco.glb' },
    pancreas: { type: 'external', path: '/models/pancreas/scene_draco.glb' },
    tongue: { type: 'external', path: '/models/tongue/scene.gltf' },
    larynx: { type: 'external', path: '/models/larynx/scene_draco.glb' },
    diaphragm: { type: 'external', path: '/models/diaphragm/scene.gltf' },
    bladder: { type: 'external', path: '/models/bladder/scene_draco.glb' },
    urinary_system: { type: 'external', path: '/models/urinary_system/scene_draco.glb' },
    adrenal_gland: { type: 'external', path: '/models/adrenal_gland/scene_draco.glb' },
    male_reproductive: { type: 'external', path: '/models/male_reproductive/scene_draco.glb' },
    female_reproductive: { type: 'external', path: '/models/female_reproductive/scene_draco.glb' },
    spinal_cord: { type: 'external', path: '/models/spinal_cord/scene_draco.glb' },
    inner_ear: { type: 'external', path: '/models/inner_ear/scene.gltf' },
    thyroid: { type: 'external', path: '/models/thyroid/scene_draco.glb' },
    pituitary: { type: 'external', path: '/models/pituitary/scene_draco.glb' },
    lymph_node: { type: 'external', path: '/models/lymph_node/scene_draco.glb' },
    ear: { type: 'external', path: '/models/ear/scene.gltf' },
    blood_cells: { type: 'external', path: '/models/blood_cells/scene_draco.glb' },
    human_cell: { type: 'external', path: '/models/human_cell/scene.gltf' },
    dna: { type: 'external', path: '/models/dna/scene_draco.glb' },
    iv_setup: { type: 'external', path: '/models/iv_setup/scene.gltf' },
    catheter: { type: 'external', path: '/models/catheter/scene_draco.glb' },
    neuron: { type: 'procedural', annotationPath: 'custom' },
    gallbladder_organ: { type: 'external', path: '/models/gallbladder_organ/scene_draco.glb' }
};

const organEmojis = {
    heart: '🫀',
    lungs: '🫁',
    kidney: '🫘',
    brain: '🧠',
    syringe: '💉',
    liver: '🩻',
    stomach: '🔴',
    eye: '👁️',
    tooth: '🦷',
    spine: '🦴',
    skin: '🩹',
    skull: '💀',
    hip_joint: '🦿',
    knee_joint: '🦵',
    shoulder_joint: '💪',
    hand: '✋',
    foot: '🦶',
    pelvis: '🦴',
    muscular_system: '🏋️',
    esophagus: '🍽️',
    small_intestine: '🔄',
    large_intestine: '🫘',
    pancreas: '🟡',
    tongue: '👅',
    larynx: '🗣️',
    diaphragm: '🌬️',
    bladder: '💧',
    urinary_system: '🚿',
    adrenal_gland: '⚡',
    male_reproductive: '♂️',
    female_reproductive: '♀️',
    spinal_cord: '⚡',
    inner_ear: '🐚',
    thyroid: '🦋',
    pituitary: '🔮',
    lymph_node: '🫛',
    ear: '👂',
    blood_cells: '🩸',
    human_cell: '🔬',
    dna: '🧬',
    iv_setup: '💉',
    catheter: '🏥',
    neuron: '🧬',
    gallbladder_organ: '🟢'
};

// Detailed structure information for interactive tooltips

