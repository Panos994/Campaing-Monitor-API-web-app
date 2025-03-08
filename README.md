# Campaign Monitor API Web App  

## Overview  
This web app tracks **Google Analytics events** and integrates with the **Campaign Monitor API** to manage a subscriber list. The project records key user interactions, such as time spent before submitting a form, button clicks, and consent tracking.  

## Features  
- **Google Analytics Event Tracking (gtag.js):**  
  - Tracks the time from the first typed input character until the submit button is clicked (`time_from_first_char`).  
  - Records button clicks and user consent for tracking.  
  - Measures response time for subscriber additions and deletions.  
- **Campaign Monitor API Integration:**  
  - Adds and removes subscribers from a mailing list.  
  - Tracks subscriber list updates.  

## Tech Stack  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js  
- **Analytics:** Google Analytics (`gtag.js`)  
- **API Integration:** [Campaign Monitor API](https://www.campaignmonitor.com/api/)  

## Repository Structure  
- The **master branch** contains the full source code.  

## Setup Instructions  
### Prerequisites  
- Install **Node.js**  
- Obtain a **Google Analytics tracking ID (G-XXXXXXXXXX)**  
- Get a **Campaign Monitor API Key**  

### Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Panos994/Campaing-Monitor-API-web-app.git
