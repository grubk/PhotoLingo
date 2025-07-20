# 📸 PhotoLingo

**PhotoLingo** is a lightweight, beginner-friendly application that helps users learn new languages by recognizing everyday objects and translating their names into different languages.

<img src="https://github.com/grubk/photolingo/blob/master/src-tauri/icons/PhotoLingoIcon.png" alt="PhotoLingo Logo" width="250">
---

## 🚀 How It Works

1. **Choose a Language**  
   Select the language you'd like to learn.

2. **Upload an Image**  
   Upload a picture of a common object.  
   > ⚠️ *Note: Only very common objects are recognized for now, as the app uses a small AI model to save the user storage space.*

3. **Translate the Object**  
   The AI will recognize the object and provide **three possible labels** in your selected language.

---

## 🌍 What Happens Next?

Once you’ve uploaded an image and selected a language, PhotoLingo:
- Uses an AI model to guess the object in the photo.
- Translates the guesses using Lingva Translate.
- Displays the translated words so you can learn how the object is named in your chosen language.

---

## 🛠️ Tech Stack

- 🧠 **MobileNet** – for image recognition  
- 🌐 **Lingva Translate** – for multilingual translation  
  [🔗 GitHub Repo](https://github.com/thedaviddelta/lingva-translate)

---

## 📦 Installation

Download the latest version from the [**Releases Page**](https://github.com/grubk/photolingo/releases) and follow the installation instructions for your platform.

---

## 🙏 Special Thanks

- [Lingva Translate](https://github.com/thedaviddelta/lingva-translate)
- MobileNet Model (TensorFlow.js)

---

## 📢 Disclaimer

This is a passion project built using **only free resources**, so please bear with any limitations. Recognition accuracy will (maybe) improve in future updates if I get rich one day and can use a better model. Who knows, maybe some day I will train my own model and waste all of the storage on my hard drive.

---

Enjoy learning new languages with **PhotoLingo**! 🌐✨
