function colorLog(message){
    console.log(`%c ${message} `, 'background: cyan; color: navy');
}

const freezeButton = `<button 
        onclick="
            document.querySelector('#frozenDescriptionBox').style.display = 'none';
            document.querySelector('#oldDescriptionBox').style.display = 'block';
            document.querySelector('#oldDescriptionBox').parentNode.style.boxShadow = '';
        "
        style="
            cursor: pointer;
            height: 2.28571em;
            line-height: 2.28571em;
            padding: 0px 10px;
            border-width: 0px;
            border-radius: 3px;
            color: var(--ds-text-inverse, #FFFFFF) !important;
            background: var(--ds-background-information-bold, #0052CC) !important;
            font-weight: 600;
        "
        type="button" >Un-Freeze
    </button>`;

// thanks Yong Wang https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    colorLog('looking for element ' + selector);
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function freezeJira(originalDescriptionBox) {
    let frozenDescriptionBox = originalDescriptionBox.cloneNode(true);
    originalDescriptionBox.style.display = 'none';
    originalDescriptionBox.parentNode.appendChild(frozenDescriptionBox);
    originalDescriptionBox.id = 'oldDescriptionBox';
    frozenDescriptionBox.id = 'frozenDescriptionBox';
    frozenDescriptionBox.style.boxShadow = '0 0 10px #9ecaed';
    frozenDescriptionBox.style.padding = '10px';
    frozenDescriptionBox.querySelector('.css-1dtwgr').classList.remove('css-1dtwgr');
    frozenDescriptionBox.innerHTML += unfreezeButton;
    colorLog('Freeze complete');
}

colorLog('the game has started at least');
waitForElm('[data-test-id="issue.views.field.rich-text.description"]').then((elem) => {
    colorLog('Found the element');
    freezeJira(elem);
});


waitForElm('[data-card-url]').then((elem) => {
    colorLog('data card url has been found');
    freezeJira(elem);
});
