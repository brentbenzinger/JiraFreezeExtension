// when the documennt loads, run yourFunction
const delay = ms => new Promise(res => setTimeout(res, ms));
const unfreezeButton = `<button 
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

const freezeJira = async () => {
    console.log('%c Waiting for description element to load ', 'background: cyan; color: navy');
    var originalElement = document.querySelector('[data-test-id="issue.views.field.rich-text.description"]');
    // poll the dom for the element 10 times a second
    var waitCount = 0;
    while (originalElement == null) {
        waitCount += 1;
        await delay(100);
        originalElement = document.querySelector('[data-test-id="issue.views.field.rich-text.description"]');
        if (waitCount > 100) {
            console.log('%c Element not found ', 'background: red; color: white');
            return;
        }
    }
    // just going to clone it while it's hot and come back and clone it again later
    clone = originalElement.cloneNode(true);
    originalElement.style.display = 'none';
    originalElement.parentNode.appendChild(clone);
    originalElement.id = 'oldDescriptionBox';
    clone.id = 'frozenDescriptionBox';
    clone.style.boxShadow = '0 0 10px #9ecaed';
    clone.style.padding = '10px';
    clone.querySelector('.css-1dtwgr').classList.remove('css-1dtwgr');
    clone.innerHTML += unfreezeButton;
    console.log('%c Freeze complete ', 'background: cyan; color: navy');
    // let's go by renderer-start-position
    console.log('%c start comparing render pos elements ', 'background: cyan; color: navy');
    // var rendererStartPosition = originalElement.querySelectorAll('[data-renderer-start-pos]');
    // if there are any nodes to render then we will wait for them to render before freezing


    // somehow jira loads the description box without having any kind of placeholder for the "SmartLinks" it's going to put in
    // but the SmartLinks will eventually get a data-card-url attribute, so we will poll for that
    // as soon as that happens we want to fire off the rest of the load sequence
    // if we don't wait for this, the SmartLinks won't be in the newElement when we clone it
    var smartLinks = originalElement.querySelectorAll('[data-card-url]');
    waitCount = 0;
    while (smartLinks.length == 0) {
        waitCount += 1;
        // wait 5 seconds and if there are no smartlinks just freeze
        if (waitCount > 50) {
            console.log('%c SmartLinks not found ', 'background: red; color: white');
            break
        }
        await delay(100);
        smartLinks = originalElement.querySelectorAll('[data-card-url]');
    }

    console.log('%c finished looping looking for smart links, ' + smartLinks.length, 'background: cyan; color: navy');

    if (smartLinks.length > 0) {
        console.log('%c we found some smart links that should get re-cloned', 'background: cyan; color: navy');
        // clone the original element into the same spot, which effectively deletes all the event listeners
        // var originalElement = document.querySelector('[data-test-id="issue.views.field.rich-text.description"]');
        // run a delete on all data attributes for the new element so Jira can't go through and mess up our links and stuff
        var newestClone = originalElement.cloneNode(true);
        newestClone.style.display = 'block';
        clone.parentNode.appendChild(newestClone);
        clone.id = 'foobarbaznone';
        clone.style.display = 'none';
        // allDescendants(newElement);
        // set the id of originalElement to oldDescriptionBox so we can reset this stuff later
        newestClone.id = 'frozenDescriptionBox';
        newestClone.style.boxShadow = '0 0 10px #9ecaed';
        newestClone.style.padding = '10px';
        // this removes the hover effect that makes the page gray and look like you can edit it
        newestClone.querySelector('.css-1dtwgr').classList.remove('css-1dtwgr');

        newestClone.innerHTML += unfreezeButton;
        console.log('%c Freeze finished ', 'background: cyan; color: navy');
    }
};

freezeJira();