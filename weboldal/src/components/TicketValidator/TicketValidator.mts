import { Html5Qrcode } from "html5-qrcode";
import "./TicketValidator.css"; 

async function ValidateTicket(QRCode: string) {
    let rsp = await fetch("/api/ticket/validate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ QRCode })
    });
    
    if (!rsp.ok) return rsp.text();
    
    return 200;
}

export class TicketValidatorComponent extends HTMLElement {
    private scanner: Html5Qrcode | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.renderState("read");
    }

    disconnectedCallback() {
        this.stopScanner();
    }

    private async initScanner() {
        const readerElement = this.querySelector("#reader");
        if (!readerElement) return;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            const statusText = this.querySelector("#status-text");
            if (statusText) statusText.innerHTML = "<strong>Hiba:</strong> A böngésző letiltotta a kamerát.";
            return;
        }

        this.scanner = new Html5Qrcode(readerElement.id);
        
        try {
            await this.scanner.start(
                { facingMode: "environment" }, 
                { 
                    fps: 15, 
                    qrbox: 250 
                },
                this.onScanSuccess.bind(this),
                undefined
            );
        } catch (err) {
            const statusText = this.querySelector("#status-text");
            if (statusText) statusText.textContent = "A kamera elérése megtagadva.";
        }
    }

    private async stopScanner() {
        if (this.scanner && this.scanner.isScanning) {
            await this.scanner.stop();
            this.scanner.clear();
        }
    }

    private async onScanSuccess(decodedText: string) {
        await this.stopScanner();
        
        const statusText = this.querySelector("#status-text");
        if (statusText) statusText.innerHTML = "<strong>Érvényesítés...</strong>";

        const response = await ValidateTicket(decodedText);

        if (response === 200) {
            this.renderState("accepted");
        } else {
            this.renderState("declined", typeof response === "string" ? response : "Érvénytelen");
        }
    }

    private renderState(state: "read" | "accepted" | "declined", errorMessage?: string) {
        let content = "";

        if (state === "read") {
            content = `
                <div class="state-container read-mode">
                    <h2>Jegy beolvasása</h2>
                    <div id="reader-container">
                        <div id="reader"></div>
                    </div>
                    <p id="status-text">Helyezd a QR-kódot a keretbe.</p>
                </div>
            `;
            setTimeout(() => this.initScanner(), 0);
        } 
        else if (state === "accepted") {
            content = `
                <div class="state-container accepted-mode">
                    <div class="icon-circle success">&#10003;</div>
                    <h2>Jegy elfogadva</h2>
                    <p>A jegy érvényes.</p>
                    <button class="action-btn" id="btn-next">Következő jegy</button>
                </div>
            `;
        } 
        else if (state === "declined") {
            content = `
                <div class="state-container declined-mode">
                    <div class="icon-circle error">&#10007;</div>
                    <h2>Jegy elutasítva</h2>
                    <p>${errorMessage}</p>
                    <button class="action-btn" id="btn-next">Újrapróbálkozás</button>
                </div>
            `;
        }

        this.innerHTML = content;

        const nextBtn = this.querySelector("#btn-next");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => this.renderState("read"));
        }
    }
}
