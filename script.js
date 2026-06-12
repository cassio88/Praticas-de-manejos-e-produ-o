document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // SISTEMA DE SEÇÕES EXPANSÍVEIS (ACCORDION)
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const content = item.querySelector(".accordion-content");
            const isExpanded = header.getAttribute("aria-expanded") === "true";
            
            header.setAttribute("aria-expanded", !isExpanded);
            if (!isExpanded) {
                content.style.display = "block";
                item.classList.add("active");
                header.querySelector(".acc-icon").textContent = "−";
            } else {
                content.style.display = "none";
                item.classList.remove("active");
                header.querySelector(".acc-icon").textContent = "+";
            }
        });
    });

    // ==========================================================================
    // CONTROLES DE ACESSIBILIDADE - DIMENSIONAMENTO DE FONTE
    // ==========================================================================
    let currentFontSizePercent = 100;
    const btnIncreaseFont = document.getElementById("btn-increase-font");
    const btnDecreaseFont = document.getElementById("btn-decrease-font");
    
    btnIncreaseFont.addEventListener("click", () => {
        if (currentFontSizePercent < 130) {
            currentFontSizePercent += 10;
            document.documentElement.style.fontSize = `${currentFontSizePercent}%`;
        }
    });
    
    btnDecreaseFont.addEventListener("click", () => {
        if (currentFontSizePercent > 80) {
            currentFontSizePercent -= 10;
            document.documentElement.style.fontSize = `${currentFontSizePercent}%`;
        }
    });

    // ==========================================================================
    // CONTROLES DE ACESSIBILIDADE - ALTERNAÇÃO DE TEMA (CLARO/ESCURO)
    // ==========================================================================
    const btnToggleTheme = document.getElementById("btn-toggle-theme");
    btnToggleTheme.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });

    // ==========================================================================
    // CONTROLES DE ACESSIBILIDADE - LEITURA POR VOZ (SpeechSynthesis API)
    // ==========================================================================
    const btnSpeechStart = document.getElementById("btn-speech-start");
    const btnSpeechStop = document.getElementById("btn-speech-stop");
    let currentUtterance = null;

    btnSpeechStart.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        
        const mainContentElement = document.getElementById("main-content");
        if (!mainContentElement) return;
        
        const textToRead = mainContentElement.innerText;
        
        currentUtterance = new SpeechSynthesisUtterance(textToRead);
        currentUtterance.lang = "pt-BR";
        currentUtterance.rate = 1.0; 
        
        btnSpeechStart.style.borderColor = "var(--color-yellow)";
        
        currentUtterance.onend = () => {
            btnSpeechStart.style.borderColor = "transparent";
        };
        currentUtterance.onerror = () => {
            btnSpeechStart.style.borderColor = "transparent";
        };

        window.speechSynthesis.speak(currentUtterance);
    });

    btnSpeechStop.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        btnSpeechStart.style.borderColor = "transparent";
    });

    // ==========================================================================
    // ÁREA DE INTERAÇÃO - SUBMISSÃO DINÂMICA DE COMENTÁRIOS
    // ==========================================================================
    const commentForm = document.getElementById("comment-form");
    const txtComment = document.getElementById("txt-comment");
    const commentsBox = document.getElementById("comments-box");
    const successMsg = document.getElementById("comment-success-msg");

    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const text = txtComment.value.trim();
        
        if (text.length < 10) {
            alert("A análise técnica precisa conter pelo menos 10 caracteres para indexação externa.");
            return;
        }

        const newCommentItem = document.createElement("div");
        newCommentItem.className = "comment-item";
        
        const now = new Date();
        const timeString = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        newCommentItem.innerHTML = `
            <span class="comment-author">OPERADOR_ANÔNIMO</span>
            <span class="comment-date">Hoje, às ${timeString}</span>
            <p class="comment-text">${escapeHTML(text)}</p>
        `;
        
        commentsBox.insertBefore(newCommentItem, commentsBox.firstChild);
        txtComment.value = "";
        successMsg.removeAttribute("hidden");
        
        setTimeout(() => {
            successMsg.setAttribute("hidden", "true");
        }, 5000);
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});