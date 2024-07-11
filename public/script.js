document.getElementById('addButton').addEventListener('click', addSubscriber);
document.getElementById('removeButton').addEventListener('click', removeSubscriberByEmail);
const apiUrl = 'http://localhost:3000/api';

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
    } catch (error) {
        console.error('Error fetching subscribers:', error);
    }
}

async function addSubscriber() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const consent = document.getElementById('consent').checked ? 'Yes' : 'No';

    try {
        const response = await fetch(`${apiUrl}/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, consent })
        });
        const result = await response.json();
        console.log('Add subscriber response:', result);

        if (result.success) {
            addSubscriberToList(name, email);
            clearAddSubscriberInputs();
        } else {
            console.error('Failed to add subscriber:', result.message);
        }
    } catch (error) {
        console.error('Error adding subscriber:', error);
    }
}

async function removeSubscriberByEmail() {
    const emailToRemove = document.getElementById('removeEmail').value;

    try {
        const response = await fetch(`${apiUrl}/subscribers`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailToRemove })
        });
        const result = await response.json();
        console.log('Remove subscriber response:', result);

        if (result.success) {
            removeSubscriberFromList(emailToRemove);
            clearRemoveSubscriberInput();
        } else {
            console.error('Failed to remove subscriber:', result.message);
        }
    } catch (error) {
        console.error('Error removing subscriber:', error);
    }
}

async function removeSubscriber(email) {
    try {
        const response = await fetch(`${apiUrl}/subscribers`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        console.log('Remove subscriber response:', result);

        if (result.success) {
            removeSubscriberFromList(email);
        } else {
            console.error('Failed to remove subscriber:', result.message);
        }
    } catch (error) {
        console.error('Error removing subscriber:', error);
    }
}

function addSubscriberToList(name, email) {
    const subscriberList = document.getElementById('subscriberList');
    const li = document.createElement('li');
    li.textContent = `${name} (${email})`;

    const button = document.createElement('button');
    button.textContent = 'Remove';
    button.onclick = () => removeSubscriber(email);

    li.appendChild(button);
    subscriberList.appendChild(li);

    console.log(`Added subscriber: ${name} (${email})`);
}

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

function clearAddSubscriberInputs() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('consent').checked = true;
}

function clearRemoveSubscriberInput() {
    document.getElementById('removeEmail').value = '';
}

fetchSubscribers();
