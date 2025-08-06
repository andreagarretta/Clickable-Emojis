const messagesContainer = document.getElementById('messages');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');

// Simple emoji regex (covers most common emojis)
const emojiRegex = /([\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD-\u25FE\u2600-\u27BF\u2B50\u2B55\u2934-\u2935\u2B06-\u2B07\u2B1B-\u2B1C\u2B05-\u2B07\u3030\u303D\u3297\u3299\uD83C\uDC04\uD83C\uDCCF\uD83C\uDD70-\uDD71\uD83C\uDD7E-\uDD7F\uD83C\uDD8E\uD83C\uDD91-\uDD9A\uD83C\uDDE6-\uDDFF\uD83C\uDE01-\uDE02\uD83C\uDE1A\uD83C\uDE2F\uD83C\uDE32-\uDE3A\uD83C\uDE50-\uDE51\uD83C\uDF00-\uDFFF\uD83D\uDC00-\uDE4F\uD83D\uDE80-\uDEF6\uD83E\uDD00-\uDDFF])/g;

function renderMessage(text, sender = 'user') {
    // Replace emojis with clickable spans
    const html = text.replace(emojiRegex, match => {
        return `<span class="emoji-clickable">${match}</span>`;
    });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = html;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function playEmojiSound() {
    const audio = new Audio('sounds/emoji.mp3');
    audio.play();
}

function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    renderMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
        addEmojiListeners();
    }, 10);
}

function addEmojiListeners() {
    const emojis = document.querySelectorAll('.emoji-clickable');
    emojis.forEach(emoji => {
        if (!emoji.dataset.listener) {
            emoji.addEventListener('click', playEmojiSound);
            emoji.dataset.listener = 'true';
        }
    });
}

sendBtn.addEventListener('click', handleSend);
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
});

emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    if (emojiPicker.style.display === 'block') {
        emojiPicker.focus();
    }
});

document.addEventListener('click', (e) => {
    if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
        emojiPicker.style.display = 'none';
    }
});

emojiPicker.addEventListener('emoji-click', event => {
    const emoji = event.detail.unicode;
    // Insert emoji at cursor position
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const value = input.value;
    input.value = value.slice(0, start) + emoji + value.slice(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + emoji.length;
    emojiPicker.style.display = 'none';
});

// Initial focus
input.focus();