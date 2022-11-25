
export function createHeader($terminal) {

    const header = document.createElement('div');
    header.classList.add('header');

    const $headerBot = document.createElement('pre');
    $headerBot.classList.add('asciibot');
    header.append($headerBot);

    const headerLogo = document.createElement('pre');
    headerLogo.classList.add('logo');
    headerLogo.innerText = app.config.logo;
    header.append(headerLogo);

    $terminal.append(header);

    return $headerBot;
}

export function createIOElements($terminal) {

    // create output container
    const $output = document.createElement('div');
    $output.classList.add('output');
    $terminal.append($output);

    // create input wrapper
    const $input = document.createElement('div');
    $input.classList.add('input');
    $terminal.append($input);

    // create input visual element
    const $inputPrint = document.createElement('span');
    $input.append($inputPrint);
    
    // An invisible input field is needed, to have the keyboard opened
    // on mobile devices. To keep the keyboard opened, focus is set
    // everytime it loses focus (blur), or document is clicked anywhere
    const $inputField = document.createElement('input');
    $inputField.addEventListener('blur', (e) => {
        const elm = e.target;
        setTimeout(() => elm.focus());
    });
    // append to terminal
    $input.append($inputField);
    
    return [ $output, $input, $inputPrint, $inputField ]
}