const text ="hello world!";

let i = 0;

const intervalId = setInterval(() => {
    
    
    //
    if (i>= text.length) {
        clearInterval(intervalId);
        return;
    } 

    term.write(text[i]);
    i++
}, 10)


