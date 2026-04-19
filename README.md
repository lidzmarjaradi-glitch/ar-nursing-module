# AR Clinical Skills Learning Module

An Augmented Reality learning module designed to enhance clinical skills education for nursing students. This system transforms a traditional clinical skills handbook into an interactive, immersive learning experience through QR-triggered 3D anatomical models.

## 🎯 Features

- **Interactive 3D Models**: Explore detailed anatomical structures including heart, lungs, kidney, brain, and medical equipment
- **QR Code Integration**: Scan QR codes from the printable handbook to instantly view AR content
- **Touch/Mouse Controls**: Rotate, zoom, and examine models from every angle
- **Educational Content**: Clinical relevance notes and key anatomical structures for each model
- **Printable Handbook**: Professional handbook pages with embedded QR codes for classroom use
- **Mobile-Friendly**: Works on any mobile device with a web browser - no app installation required

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Navigate to the project directory:
   ```bash
   cd ar-nursing-module
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📱 How to Use

### For Students

1. **Access the Landing Page**: Open `http://localhost:3000` on your device
2. **Browse 3D Models**: Click on any organ card to view its QR code
3. **Use the AR Viewer**: Go to "AR Viewer" to explore 3D models directly
4. **Scan from Handbook**: Print the handbook and scan QR codes with your phone camera

### For Instructors

1. **Print the Handbook**: Navigate to "Printable Handbook" and use your browser's print function
2. **Distribute to Students**: Students can scan QR codes with their mobile devices
3. **Classroom Demonstrations**: Use the AR Viewer on a projector for group learning

## 📂 Project Structure

```
ar-nursing-module/
├── package.json          # Project dependencies
├── server.js             # Express server with API endpoints
├── public/
│   ├── index.html        # Main landing page
│   ├── ar-viewer.html    # 3D model viewer with controls
│   └── handbook.html     # Printable handbook with QR codes
└── README.md             # This file
```

## 🔧 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/models` | Returns list of all available 3D models with metadata |
| `GET /api/qrcode/:organ` | Generates QR code for specified organ model |

## 🫀 Available Models

1. **Human Heart** - Cardiovascular anatomy for cardiac assessment
2. **Human Lungs** - Respiratory system for breath sounds auscultation  
3. **Human Kidney** - Urinary system for renal assessment
4. **Human Brain** - Nervous system for neurological evaluation
5. **Medical Syringe** - Injection technique and equipment familiarity

## 🎓 Educational Framework

This module is grounded in:
- **Constructivist Learning Theory**: Active interaction with learning materials
- **Dual Coding Theory**: Combined verbal and visual information
- **Experiential Learning Theory**: Learning through experience and reflection

## 💻 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript, Three.js
- **Backend**: Node.js, Express.js
- **QR Generation**: qrcode library
- **3D Rendering**: Three.js with procedural geometry

## 📋 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome for Android)

## 🔮 Future Enhancements

- Additional anatomical models (digestive system, skeletal system)
- AR marker-based tracking for true augmented reality
- Voice annotations for hands-free learning
- Assessment quizzes integrated with 3D models
- Multi-language support

## 📄 License

MIT License - Feel free to use and modify for educational purposes.

---

*Developed as part of the AR Clinical Skills Learning Module project for nursing education.*


