window.onload = function() {
    subaa();
    addEnter();
}

// Prevents form behavior
$("#formi").submit(function(event) {
    event.preventDefault();
});

// Adds enter-key option for submitting form
function addEnter() {
    var input = document.getElementById("name");
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("lisaa").click();
            }
    });
}

// Gets workers list
function subaa (){
    // GET from firebase-------------------------
    var HttpClient = function() {
        this.get = function(aUrl, aCallback) {
            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() { 
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
            anHttpRequest.open( "GET", aUrl, true );            
            anHttpRequest.send( null );
        }
    }

    var client = new HttpClient();
    client.get('https://worktrip-312ba.firebaseio.com/Workers.json', function(response) {
        // Change JSON into an object
        var mailiObjekti=JSON.parse(response);
        var mailiArray=[];
        // Makes object into an array
        for(let key in mailiObjekti){
            mailiObjekti[key].id=key;
            mailiArray.push(mailiObjekti[key]);
        }
        // console.log("mailarray",mailiArray);

        let city_home = document.getElementById('city_home').options;
        let city_work = document.getElementById('city_work').options;
        let worker_job = document.getElementById('job').options;

        var options_kotikaupunki=[];
        var options_tyokaupunki=[];
        var options_tyo=[];
        var i=1;
        // Adds individual values to its own arrays for later filtering and prints current workers as list-items
        mailiArray.forEach(mailiArray =>{
            options_kotikaupunki.push(mailiArray.Kotikaupunki);
            options_tyokaupunki.push(mailiArray.Työkaupunki);
            options_tyo.push(mailiArray.Työ);
            makeLi(i+" Kotikaupunki: "+ mailiArray.Kotikaupunki+", Työkaupunki: "+ mailiArray.Työkaupunki+", Työ: "+ mailiArray.Työ+", Nimi: "+ mailiArray.Nimi);
            i++;
        });

        // Filters doubles in array
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }
        var filtered_kotikaupunki = options_kotikaupunki.filter( onlyUnique );
        var filtered_tyokaupunki=options_tyokaupunki.filter( onlyUnique );
        var filtered_tyo=options_tyo.filter( onlyUnique );
        // console.log("koti",filtered_kotikaupunki,"tyok",filtered_tyokaupunki,"tyo",filtered_tyo)

        // Adds filtered options as options
        filtered_kotikaupunki.forEach(filtered_kotikaupunki =>{
            city_home.add(
                new Option(filtered_kotikaupunki)
        )});
        filtered_tyokaupunki.forEach(filtered_tyokaupunki =>{
            city_work.add(
                new Option(filtered_tyokaupunki)
        )});
        filtered_tyo.forEach(filtered_tyo =>{
            job.add(
                new Option(filtered_tyo)
        )});
    });
    
}

function addWorker(){
    // Fetches values
    let homecity=document.getElementById("city_home").options[document.getElementById("city_home").selectedIndex].value;
    let workcity= document.getElementById("city_work").options[document.getElementById("city_work").selectedIndex].value;
    let job=document.getElementById("job").options[document.getElementById("job").selectedIndex].value;
    let name=document.getElementById("name").value;
    
    // Uses values to make an object
    let worker_info={
        homeCity:homecity,
        workCity:workcity,
        Job:job,
        Name:name
    }
    if (!homecity.includes("Valitse kotikaupunki")&&!workcity.includes("Valitse työkaupunki")&&!job.includes("Valitse Työnkuva")&& name.length>2) {       
        // POST Firebase--------------------
        var xhr = new XMLHttpRequest();
        var url = "https://worktrip-312ba.firebaseio.com/Workers.json";
        xhr.open("POST", url, true);
        var data = JSON.stringify({
            Kotikaupunki: worker_info.homeCity,
            Työkaupunki: worker_info.workCity,
            Työ:worker_info.Job,
            Nimi:worker_info.Name
        });
        // For adding cities and jobs manually
        // var data = JSON.stringify({
        //     Kotikaupunki:"Mikkeli",
        //     Työkaupunki: "Kuusamo",
        //     Työ:"Devaaja",
        //     Nimi:"Maati Raipe"
        // });

        // Send data to firebase database
        xhr.send(data);
        console.log("Haku lisätty tietokantaan (" + name +")")
        document.getElementById("varoitus").innerHTML="Haku lisätty tietokantaan (" + name +")";
        document.getElementById("varoitus").style.display="block";
    }
    else{
        document.getElementById("varoitus").style.display="block";
        console.log("Täytä kaikki kohdat!")
    }
}

// Makes list item
function makeLi(worker){
    var para = document.createElement("li");
    var node = document.createTextNode(worker);
    para.appendChild(node);
    // para.setAttribute("id", "div1");
    document.getElementById("workers").appendChild(para);
}

// Display available workers
function display_workers_kotikaupunki(equal) {
    var workers_li=Array.from(document.getElementsByTagName('li'));
    let homecity=document.getElementById("city_home").options[document.getElementById("city_home").selectedIndex].value;
    let workcity= document.getElementById("city_work").options[document.getElementById("city_work").selectedIndex].value;
    let job=document.getElementById("job").options[document.getElementById("job").selectedIndex].value;
 
    workers_li.forEach(element => {
        element.style.display="none";
    });

    workers_li.forEach(element => {
        if (!homecity.includes("Valitse kotikaupunki")){
            if (!workcity.includes("Valitse työkaupunki")) {
                if (!job.includes("Valitse Työnkuva")) {
                    if (element.textContent.includes("Työkaupunki: "+workcity) && element.textContent.includes("Kotikaupunki: " +homecity) &&  element.textContent.includes(job)) {
                        element.style.display="";
                    }
                }
                else {
                    if(element.textContent.includes("Kotikaupunki: " +homecity) &&  element.textContent.includes("Työkaupunki: "+workcity)){
                        element.style.display="";
                    }
                }
            }
            else if (!job.includes("Valitse Työnkuva")) {
                if (element.textContent.includes("Kotikaupunki: "+homecity) &&  element.textContent.includes(job)) {
                    element.style.display="";
                }
            }
            else if(element.textContent.includes("Kotikaupunki: "+homecity)){
                element.style.display="";
            }
        }
        else{location.reload();}
    });
}
function display_workers_tyokaupunki(equal) {
    var workers_li=Array.from(document.getElementsByTagName('li'));
    let homecity=document.getElementById("city_home").options[document.getElementById("city_home").selectedIndex].value;
    let workcity= document.getElementById("city_work").options[document.getElementById("city_work").selectedIndex].value;
    let job=document.getElementById("job").options[document.getElementById("job").selectedIndex].value;
 
    workers_li.forEach(element => {
        element.style.display="none";
    });

    workers_li.forEach(element => {
        if (!workcity.includes("Valitse työkaupunki")){
            if (!homecity.includes("Valitse kotikaupunki")) {
                if (!job.includes("Valitse Työnkuva")) {
                    if (element.textContent.includes("Työkaupunki: "+workcity) && element.textContent.includes("Kotikaupunki: " +homecity) &&  element.textContent.includes(job)) {
                        element.style.display="";
                    }
                }
                else {
                    if(element.textContent.includes("Kotikaupunki: " +homecity) &&  element.textContent.includes("Työkaupunki: "+workcity)){
                        element.style.display="";
                    }
                }
            }
            else if (!job.includes("Valitse Työnkuva")) {
                if (element.textContent.includes("Työkaupunki: "+workcity) &&  element.textContent.includes(job)) {
                    element.style.display="";
                }
            }
            else if(element.textContent.includes("Työkaupunki: "+workcity)){
                element.style.display="";
            }
        }
        else{location.reload();}
    });
}
function display_workers_tyo(equal) {
    var workers_li=Array.from(document.getElementsByTagName('li'));
    let homecity=document.getElementById("city_home").options[document.getElementById("city_home").selectedIndex].value;
    let workcity= document.getElementById("city_work").options[document.getElementById("city_work").selectedIndex].value;
    let job=document.getElementById("job").options[document.getElementById("job").selectedIndex].value;
 
    workers_li.forEach(element => {
        element.style.display="none";
    });

    workers_li.forEach(element => {
        if (!job.includes("Valitse Työnkuva")){
            if (!homecity.includes("Valitse kotikaupunki")) {
                if (!workcity.includes("Valitse työkaupunki")) {
                    if (element.textContent.includes("Työkaupunki: "+workcity) && element.textContent.includes(homecity) &&  element.textContent.includes(job)) {
                        element.style.display="";
                    }
                }
                else {
                    if(element.textContent.includes(job) &&  element.textContent.includes("Kotikaupunki: "+homecity)){
                        element.style.display="";
                    }
                }
            }
            else if (!workcity.includes("Valitse työkaupunki")) {
                if (element.textContent.includes("Työkaupunki: "+workcity) &&  element.textContent.includes(job)) {
                    element.style.display="";
                }
            }
            else if(element.textContent.includes("Työ: "+job)){
                element.style.display="";
        }
        }
        else{location.reload();}
    });
}
// Display available workers end
