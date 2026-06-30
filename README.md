# ShopSmart E-Commerce Application 🛒✨

An advanced, highly interactive modern e-commerce web application built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**. ShopSmart features an integrated **AI Chatbot** powered by Google's Gemini 2.0 Flash model, multi-currency support, dark mode, dynamic cart & wishlist management, and modern UI components.

## 🌟 Key Features

* **AI Shopping Assistant (ShopBot):** Integrated directly into the platform, leveraging the **Gemini 2.0 Flash API** to give users real-time answers, product recommendations, and comparisons dynamically.
* **Smart Cart & Checkout System:** Flawless shopping cart operations with quantity managers, real-time total updates, applied discount code states, and responsive checkout forms.
* **Product Comparison & Wishlist:** Fully functional ⚖️ Compare system alongside a dedicated ❤️ Wishlist page backed by Context APIs and local data persistence.
* **Multi-Currency & Theme Support:** Dynamic currency conversions and a seamless Global Dark Mode / Light Mode toggle.
* **Search Autocomplete:** Immediate fast-search capabilities with a responsive dropdown, search history, and a smart clear button.
* **Modern UI Elements:** Clean, aesthetic interface paired strictly with `lucide-react` icons and smooth CSS transitions.

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, React Router DOM
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Backend Cloud Integration:** Firebase (Firestore / Authentication)
* **AI Capabilities:** Google Generative AI (`gemini-2.0-flash`)

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Ensure you have Node.js and npm installed.
```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanishkraj2005/Shop-Smart.git
   cd ecommerce
   ```

2. **Install NPM Packages**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase credentials and Gemini API Key:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # (Gemini Key can also be handled within the front-end securely per deployment, or injected below)
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to HTTP localhost address provided in your terminal (usually `http://localhost:5173/`).

## 📁 Project Structure highlights

* `/src/components`: UI components such as Navbar, Chatbot, ProductCards, and Notifications.
* `/src/context`: React Context Providers handling Auth, Cart, Wishlist, Theme, and Currency logic.
* `/src/pages`: Distinct application views (Home, Cart, Checkout, Compare, etc.).
* `/src/data`: Contains the main products database and metadata logic.
* `/src/firebase`: Firebase configuration (`config.js`).

## 👨‍💻 Developer Notes
This app has been painstakingly crafted using strictly human-written standard components. Dead codes, unused CSS sheets, and arbitrary placeholder scripts have been effectively pruned for an incredibly smooth and unbloated React structure. 

## 📝 License

Distributed under the MIT License.
