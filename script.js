const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search span");
let audio;
function getexample(result){
    for(var i=0;i<result[0].meanings.length;i++){
        for(var j=0;j<result[0].meanings[i].definitions.length;j++){
            if(result[0].meanings[i].definitions[j].example!=null && result[0].meanings[i].definitions[j].example!=undefined ){
                return result[0].meanings[i].definitions[j].example;
            }
        }
    }
    return null;
}
function getsynonym(result){
    for(var i=0;i<result[0].meanings.length;i++)
    {
        if(result[0].meanings[i].synonyms[0]!=null && result[0].meanings[i].synonyms[0]!=undefined ){
            return result[0].meanings[i].synonyms[0];
    }
    }
    return null;
}
function getantonym(result){
    for(var i=0;i<result[0].meanings.length;i++)
    {
        if(result[0].meanings[i].antonyms[0]!=null && result[0].meanings[i].antonyms[0]!=undefined )
        {
            return result[0].meanings[i].antonyms[0];
        }
    }
    return null;
}
function getaudio(result){
    for(var i=0;i<result[0].phonetics.length;i++){
        if(result[0].phonetics[i].audio!=null && result[0].phonetics[i].audio!=undefined && result[0].phonetics[i].audio!="" )
        {
            return result[0].phonetics[i].audio;
        }
    }
    return null;
}
function getphonetics(result){
    for(var i=0;i<result[0].phonetics.length;i++){
        if(result[0].phonetics[i].text!=null && result[0].phonetics[i].text!=undefined && result[0].phonetics[i].text!="" )
        {
            return result[0].phonetics[i].text;
        }
    }
    return null;
}
function data(result, word){
    if(result.title){
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }
    else
    {
        wrapper.classList.add("active");

        let tempphonetic=getphonetics(result);
        if(tempphonetic==null || tempphonetic===null){
            tempphonetic="";
        }

        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech}${tempphonetic}`;
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;


        var tempexample=getexample(result);
        if(tempexample==null || tempexample===null){
            document.getElementsByClassName("example")[0].style.display="none";
        }
        else{
            document.querySelector(".example span").innerText = tempexample;
        }


        var tempsynonym=getsynonym(result);
        if(tempsynonym==null || tempsynonym===null){
            document.getElementsByClassName("synonyms")[0].style.display="none";
        }
        else{
            document.querySelector(".synonyms .list").innerText = tempsynonym;
        }

        var tempantonym=getantonym(result);
        if(tempantonym==null || tempantonym===null){
            document.getElementsByClassName("antonyms")[0].style.display="none";
        }
        else{
            document.querySelector(".antonyms .list").innerText = tempantonym;
        }

        var tempaudio=getaudio(result);
        if(tempaudio==null || tempaudio===null){
            document.querySelector(".word i").style.display="none";
        }
        else
        {
            audio = new Audio(tempaudio);
           
        }
        

    }
}

function search(word){
    fetchApi(word);
    searchInput.value = word;
}

function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => {
        console.log(result);
        return data(result, word)
    }
        ).catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key == "Enter" && word){
        fetchApi(word);
    }
});

volume.addEventListener("click", ()=>{
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() =>{
        volume.style.color = "#999";
    }, 800);
});

removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word";
});
