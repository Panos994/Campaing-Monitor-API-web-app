/*
Clicks to add a subscriber (click_add_subscriber)
Clicks to remove a subscriber (click_remove_subscriber)
Successful addition of a subscriber (successful_addition)
Successful removal of a subscriber (successful_removal)
Errors from the Campaign Monitor API (error_cm_api)
*/

// API base URL
const apiUrl = 'http://localhost:3000/api';

// Event listeners for buttons
document.getElementById('addButton').addEventListener('click', handleAddSubscriber);
document.getElementById('removeButton').addEventListener('click', handleRemoveSubscriber);

// Function to fetch subscribers and populate the list
async function fetchSubscribers() {
    try {
        const response = await fetch(`${apiUrl}/subscribers`);
        const data = await response.json();
        console.log('Fetched subscribers:', data);

        const subscriberList = document.getElementById('subscriberList');
        subscriberList.innerHTML = '';

        data.forEach(subscriber => {
            addSubscriberToList(subscriber.Name, subscriber.EmailAddress);
        });

        gtag('set', {
            'subscriber_count': data.length
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
    }
}

// Function to handle adding a subscriber
async function handleAddSubscriber() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const consent = document.getElementById('consent').checked ? 'Yes' : 'No';

    if (!name || !email) {
        console.error('Name and email are required');
        return;
    }

    const startTime = Date.now(); // Start time measurements

    try {
        const response = await fetch(`${apiUrl}/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, consent })
        });

        const endTime = Date.now(); // End time measurement
        const timeToResponse = endTime - startTime; // Calculate response time

        const result = await response.json();
        console.log('Add subscriber response:', result);

        if (result.success) {
            const isPersonal = isPersonalEmail(email);

            gtag('event', 'successful_addition', {
                'email_type': isPersonal ? 'personal' : 'generic',
                'time_to_response': timeToResponse,
                'consent_status': consent // Include consent status
            });

            addSubscriberToList(name, email);
            clearAddSubscriberInputs();
        } else {
            console.error('Failed to add subscriber:', result.message);
        }
    } catch (error) {
        console.error('Error adding subscriber:', error);

        gtag('event', 'error_cm_api', {
            'error_message': error.message,
            'action': 'add'
        });
    }
}

// Function to handle removing a subscriber by email
async function handleRemoveSubscriber() {
    const emailToRemove = document.getElementById('removeEmail').value;
    const startTime = Date.now(); // Start time measurements

    if (!emailToRemove) {
        console.error('Email is required');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/subscribers`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailToRemove })
        });

        const endTime = Date.now(); // End time measurement
        const timeToResponse = endTime - startTime; // Calculate response time

        const result = await response.json();
        console.log('Remove subscriber response:', result);

        if (result.success) {
            const isPersonal = isPersonalEmail(emailToRemove);

            gtag('event', 'successful_removal', {
                'email_type': isPersonal ? 'personal' : 'generic',
                'time_to_response': timeToResponse
            });

            removeSubscriberFromList(emailToRemove);
            clearRemoveSubscriberInput();
        } else {
            console.error('Failed to remove subscriber:', result.message);

            gtag('event', 'error_cm_api', {
                'error_message': result.message,
                'action': 'remove'
            });
        }
    } catch (error) {
        console.error('Error removing subscriber:', error);

        gtag('event', 'error_cm_api', {
            'error_message': error.message,
            'action': 'remove'
        });
    }
}

// Function to add a subscriber to the list on the UI
function addSubscriberToList(name, email) {
    const subscriberList = document.getElementById('subscriberList');
    const existingItems = Array.from(subscriberList.getElementsByTagName('li'));

    if (existingItems.some(item => item.textContent.includes(email))) {
        console.log(`Subscriber with email ${email} is already in the list.`);
        return;
    }

    const li = document.createElement('li');
    li.textContent = `${name} (${email})`;

    const button = document.createElement('button');
    button.textContent = 'Remove';
    button.onclick = () => removeSubscriber(email);

    li.appendChild(button);
    subscriberList.appendChild(li);

    console.log(`Added subscriber: ${name} (${email})`);
}

// Function to remove a subscriber from the list on the UI
function removeSubscriberFromList(email) {
    const subscriberList = document.getElementById('subscriberList');
    const items = subscriberList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        if (items[i].textContent.includes(email)) {
            subscriberList.removeChild(items[i]);
            console.log(`Removed subscriber with email: ${email}`);
            break;
        }
    }
}

// Function to clear input fields after adding a subscriber
function clearAddSubscriberInputs() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('consent').checked = false;
}

// Function to clear input field after removing a subscriber
function clearRemoveSubscriberInput() {
    document.getElementById('removeEmail').value = '';
}

// Function to detect if email is personal or generic
function isPersonalEmail(email) {
    const genericDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'];
    const domain = email.split('@')[1];
    return !genericDomains.includes(domain);
}

// Track clicks to add subscriber
document.getElementById('addButton').addEventListener('click', async () => {
    const startTime = Date.now(); //returns time in ms
    console.log('Start time:', startTime);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const timeToClick = Date.now() - startTime;
    console.log('Time to click:', timeToClick);
    const isPersonal = isPersonalEmail(email);
    let hasErrors = false;

    if (!name || !email) {
        hasErrors = true;
    }

    gtag('event', 'click_add_subscriber', {
        'time_to_click': timeToClick,
        'email_type': isPersonal ? 'personal' : 'generic',
        'errors': hasErrors
    });

    await handleAddSubscriber();
});

// Track clicks to remove subscriber
document.getElementById('removeButton').addEventListener('click', async () => {
    const startTime = Date.now();
    console.log('Start time:', startTime);
    const email = document.getElementById('removeEmail').value;

    const timeToClick = Date.now() - startTime;
    console.log('Time to click:', timeToClick);
    const isPersonal = isPersonalEmail(email);
    let hasErrors = false;

    if (!email) {
        hasErrors = true;
    }

    gtag('event', 'click_remove_subscriber', {
        'time_to_click': timeToClick,
        'email_type': isPersonal ? 'personal' : 'generic',
        'errors': hasErrors
    });

    await handleRemoveSubscriber();
});

// Fetch initial subscribers on page load
fetchSubscribers();
