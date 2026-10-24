# Phone Face-Off ⚡

> **An interactive smartphone evaluation, weighted recommendation engine, and head-to-head comparison dashboard built with pure vanilla web technologies.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Canvas 2D](https://img.shields.io/badge/Canvas_2D-6366F1?style=for-the-badge&logo=opengl&logoColor=white)
![No Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge)
![Author](https://img.shields.io/badge/Author-Abhinav_Chitrey-38bdf8?style=for-the-badge&logo=github)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://chitreyabhinav.github.io/Phone-FaceOff/)

👉 **Live Demo**: [https://chitreyabhinav.github.io/Phone-FaceOff/](https://chitreyabhinav.github.io/Phone-FaceOff/)

---

## 🚀 Highlights & Features

- **📱 413-Phone Comprehensive Database**:
  Curated dataset of 413 real and modern smartphone models containing prices (USD with auto-calculated INR conversion), ratings, camera MP, battery capacity, storage, RAM, weight, display type, and processors.

- **🎨 Spec-Driven Procedural SVG Illustrations**:
  Phones are dynamically drawn in vector SVG based on real specifications:
  - Lens dots reflect camera megapixel category.
  - Status bar battery level reflects mAh capacity.
  - Phone dimensions scale according to physical screen inches.
  - Reusable SVG `<symbol>` instancing for high-performance 60 FPS scrolling.

- **⚖️ Weighted Multi-Criteria Recommendation Algorithm**:
  Fine-tune your priorities (Price, Rating, Camera, Battery, Storage, RAM, Weight) or choose one-click personas:
  - 🎓 **Student** (balanced budget, long battery, high RAM)
  - 🎮 **Gamer** (maximum RAM, high battery, performance focus)
  - 📸 **Photographer** (sharpest camera, high storage)
  - ✈️ **Traveller** (compact weight, large battery)
  - 🏷️ **Budget hunter** (lowest price per feature)
  - 👑 **Flagship fan** (uncompromising peak specs)
  - ⚖️ **Balanced** (equal weighting across all dimensions)

- **⚡ 5-Phone Face-Off Arena**:
  - Interactive **5-axis radar chart** comparing phone capability footprints.
  - Dynamic **head-to-head breakdown table** highlighting segment winners in each spec.
  - Automated **Champion Verdict** calculating match scores out of 100 with advantage chips and celebration bursts.

- **🌌 2D Canvas "Galaxy Map"**:
  Interactive scatter plot plotting every single smartphone by its price versus priority match score. Hover to inspect devices; click to draft them into your top five.

- **🔍 Fuzzy Search & Brand Filters**:
  Instant letter-by-letter search featuring typo-tolerant Levenshtein distance matching and keyword highlighting. Filter instantly by brand bubbles (Samsung, Apple, Xiaomi, OnePlus, Realme, etc.).

- **🔀 "Shuffle 5" Instant Battle Mode**:
  Randomly draft 5 contenders with one click to discover and benchmark new devices.

- **🪐 Atmospheric Canvas Background**:
  Procedural cosmic background featuring layered parallax starfields, shooting stars, and a pre-rendered planetary ring sprite with idle frame-rate throttler for battery efficiency.

- **🔗 Shareable Battle Links**:
  Deep-links save your active contenders, sliders, and budget directly in the URL hash (`#s=...&w=...&b=...`).

---

## 🛠️ Project Structure

```text
Phone_FaceOff/
├── index.html        # Semantic HTML5 layout, SVG symbols, navigation dock
├── README.md         # Comprehensive documentation
├── README.txt        # Quick start reference
├── css/
│   └── style.css     # Glassmorphic dark UI, spring physics keyframes, responsive grid
└── js/
    ├── data.js       # 413 smartphone dataset [name, rating, price, camera, display, ...]
    ├── space.js      # Procedural canvas parallax starfield, shooting stars & planet
    └── script.js     # Scoring engine, radar math, fuzzy search, Galaxy map & events
```

---

## 🏁 Quick Start (Run Locally)

This project requires **zero build tools, zero dependencies, and no node_modules**.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chitreyAbhinav/Phone-FaceOff.git
   cd Phone-FaceOff
   ```

2. **Open the application**:
   - Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari, Brave).

---

## 👨‍💻 Author

**Abhinav Chitrey**
- GitHub: [@chitreyAbhinav](https://github.com/chitreyAbhinav)

---

## 📄 License

Open-source and available under the [MIT License](LICENSE).
