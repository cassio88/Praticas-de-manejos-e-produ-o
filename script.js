document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONTEXTO DE CONTROLE DE FONTES
    // ==========================================
    let currentFontSize = 100; // Valor percentual base
    const baseHtml = document.documentElement;

    document.getElementById('btn-increase-font').addEventListener('click', () => {
        if (currentFontSize < 140) {
            currentFontSize += 10;
            baseHtml.style.fontSize = `${currentFontSize}%`;
        }
    });

    document.getElementById('btn-decrease-font').addEventListener('click', () => {
        if (currentFontSize > 80) {
            currentFontSize -= 10;
            baseHtml.style.fontSize = `${currentFontSize}%`;
        }
    });

    // ==========================================
    // 2. ALTERNADOR DE TEMA (CONTRASTE)
    // ==========================================
    const toggleThemeBtn = document.getElementById('btn-toggle-theme');
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-contrast');
    });

    // ==========================================
    // 3. LEITURA POR VOZ AVANÇADA (SPEECH SYNTHESIS)
    // ==========================================
    const startVoiceBtn = document.getElementById('btn-start-voice');
    const stopVoiceBtn = document.getElementById('btn-stop-voice');
    let speechUtterance = null;

    startVoiceBtn.addEventListener('click', () => {
        // Zera leituras anteriores ativas
        window.speechSynthesis.cancel();

        // Seleciona exclusivamente o container principal do artigo
        const mainContentElement = document.getElementById('content-core');
        if (!mainContentElement) return;

        // Filtra e junta apenas as strings textuais legíveis
        const textBlocks = Array.from(mainContentElement.querySelectorAll('p, h2, h3, .accordion-trigger'))
            .map(el => el.textContent)
            .join(' ');

        if (textBlocks.trim().length === 0) return;

        speechUtterance = new SpeechSynthesisUtterance(textBlocks);
        speechUtterance.lang = 'pt-BR';
        speechUtterance.rate = 1.0;

        window.speechSynthesis.speak(speechUtterance);
    });

    stopVoiceBtn.addEventListener('click', () => {
        window.speechSynthesis.cancel();
    });

    // ==========================================
    // 4. MÓDULOS EXPANSÍVEIS (ACCORDIONS)
    // ==========================================
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('.accordion-icon');

            trigger.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;

            if (!isExpanded) {
                icon.textContent = '-';
                content.style.display = 'block';
            } else {
                icon.textContent = '+';
                content.style.display = 'none';
            }
        });
    });

    // ==========================================
    // 5. CAIXA DE TRANSMISSÃO DE COMENTÁRIOS
    // ==========================================
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('reader-comment');
    const commentsBox = document.getElementById('comments-box');
    const statusLog = document.getElementById('comment-status');
    let userIndex = 100;

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = commentInput.value.trim();

        if (text) {
            userIndex++;
            statusLog.textContent = '> TRANSMISSÃO EM ANDAMENTO... CONECTANDO TERMINAL AGROFORTE...';
            
            setTimeout(() => {
                const newNode = document.createElement('div');
                newNode.className = 'comment-node';
                newNode.innerHTML = `<span class="node-user">SYS_USER_${userIndex}:</span> ${text}`;
                
                // Insere no topo da árvore de comentários
                commentsBox.insertBefore(newNode, commentsBox.firstChild);
                
                commentInput.value = '';
                statusLog.textContent = '';
            }, 800);
        }
    });
});