// Demo interface JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('demoForm');
    const resultsSection = document.getElementById('results');
    const loadingSection = document.getElementById('loading');
    const resultContent = document.getElementById('resultContent');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        showLoading();

        try {
            const formData = new FormData(form);
            const demoData = Object.fromEntries(formData.entries());

            const response = await fetch(`/run-demo/${window.appId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(demoData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Demo failed');
            }

            displayResults(result.result);

        } catch (error) {
            console.error('Error running demo:', error);
            showError(error.message);
        }
    });

    function showLoading() {
        form.style.display = 'none';
        resultsSection.style.display = 'none';
        loadingSection.style.display = 'block';
    }

    function showResults() {
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';
    }

    function showError(message) {
        loadingSection.style.display = 'none';
        form.style.display = 'block';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #f5c6cb;
            margin-top: 20px;
        `;

        const container = document.querySelector('.demo-form');
        container.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function displayResults(result) {
        let html = '';

        switch (result.type) {
            case 'adflow-studio':
                html = `
                    <h4>🎬 Ad Created for ${result.productName}</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Platform:</strong> ${result.platform}<br>
                        <strong>Ad Copy:</strong> ${result.adCopy.substring(0, 100)}...<br>
                        <strong>Voiceover:</strong> Generated (${result.voiceover ? 'Available' : 'Not generated'})
                    </div>
                    <p><em>Product image and video ad would be generated in a full implementation.</em></p>
                `;
                break;

            case 'talkbase':
                html = `
                    <h4>🤖 TalkBase Response</h4>
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Your question:</strong> ${result.question}
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>AI Response:</strong> ${result.answer}
                    </div>
                    ${result.sources && result.sources.length > 0 ? `
                        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <strong>Sources:</strong>
                            <ul>
                                ${result.sources.map(source => `<li><a href="${source.url}" target="_blank">${source.title}</a></li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                `;
                break;

            case 'maplens-ai':
                html = `
                    <h4>🏪 MapLens AI Analysis</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Business:</strong> ${result.businessName} (${result.businessType})<br>
                        <strong>Location:</strong> ${result.coordinates.latitude}, ${result.coordinates.longitude}
                    </div>
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Location Data:</strong> ${result.locationInfo}
                    </div>
                    <div style="background: #f0f8e7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Brand Content:</strong> ${result.brandContent.substring(0, 200)}...
                    </div>
                `;
                break;

            case 'scenewriter-pro':
                html = `
                    <h4>🎬 SceneWriter Pro Script</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Prompt:</strong> ${result.prompt}
                    </div>
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Script:</strong><br><pre>${result.script}</pre>
                    </div>
                    <div style="background: #f0f8e7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Storyboard:</strong><br><pre>${result.storyboard}</pre>
                    </div>
                    <p><strong>Estimated Duration:</strong> ${result.estimatedDuration}</p>
                `;
                break;

            case 'instatranscribe':
                html = `
                    <h4>📝 InstaTranscribe Analysis</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Duration:</strong> ${result.duration}
                    </div>
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Transcription:</strong> ${result.transcription}
                    </div>
                    <div style="background: #f0f8e7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Analysis:</strong><br>${result.analysis}
                    </div>
                `;
                break;

            case 'pixsense':
                html = `
                    <h4>🖼️ PixSense Analysis</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Confidence:</strong> ${(result.confidence * 100).toFixed(1)}%<br>
                        <strong>Processing Time:</strong> ${result.processingTime}
                    </div>
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Image Description:</strong> ${result.imageDescription}
                    </div>
                    <div style="background: #f0f8e7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Analysis:</strong><br>${result.analysis}
                    </div>
                `;
                break;

            case 'gemvoice':
                html = `
                    <h4>🎤 GemVoice Conversation</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Topic:</strong> ${result.topic}<br>
                        <strong>Style:</strong> ${result.conversationStyle}
                    </div>
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Response:</strong> ${result.textResponse}
                    </div>
                    <div style="background: #f0f8e7; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>Voice Generation:</strong> ${result.voiceResponse ? 'Audio generated' : 'Text only'}
                    </div>
                `;
                break;

            default:
                html = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
        }

        resultContent.innerHTML = html;
        showResults();
    }
});
