# 🌍 Reveal Location

A fun and interactive web application that allows users to share their geographic location with a beautiful, animated interface.

![Screenshot of the application](images/icon.png)

## ✨ Features

- 🌐 Real-time location sharing
- 🎨 Beautiful glassmorphism UI with animated particles
- 🔒 Secure and private - location data is not stored
- ⚡ Rate limited API to prevent abuse
- 📱 Responsive design that works on all devices
- 🎮 Playful bouncy ball theme

## 🚀 Demo

You can try out the live demo [here](https://davidsovan.github.io/Reveal-Location/).

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DavidSovan/Reveal-Location.git
   cd Reveal-Location
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 🧩 How It Works

1. The application requests your location permission when you click the "Reveal My Location" button.
2. If granted, it retrieves your coordinates using the browser's Geolocation API.
3. The location data is sent to the server via a secure API endpoint.
4. The server processes the request and returns a success message.
5. The UI updates to show your location was successfully shared.

## 🔒 Privacy

- Your location data is only used to demonstrate the feature and is not stored or logged.
- The application implements rate limiting to prevent abuse (5 requests per minute per IP).
- All data transmission is encrypted using HTTPS.

## 🌟 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS3 Animations, Glassmorphism Design
- **Backend**: Node.js with Express (API endpoint)
- **Dependencies**:
  - node-fetch
  - whatwg-url
  - webidl-conversions

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.


Made with ❤️ by [David Sovan](https://github.com/DavidSovan)
