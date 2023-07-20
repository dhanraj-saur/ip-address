
let fetchBtn = document.getElementById("btn")

let landingPage = document.getElementById("landing-page")
let mainPage = document.getElementById("main")


let postalData;

fetchBtn.addEventListener("click", async () => {

    landingPage.style.display = "none"
    mainPage.style.display = "block"
    let result = await getIp()
  
    let ipinfo = await getIpInfo(result.ip)
    postalData = await getPostalAddress(ipinfo.postal)
 
    showGoogleMap(ipinfo)
    displayData(ipinfo,postalData) 
    
})


function displayData(ipinfo,postalData){
    showTimeZone(ipinfo, postalData)
}



async function getIp() {
    let res = await fetch("https://api.ipify.org/?format=json")
    let rep = await res.json()
    return rep;
   
}

async function getIpInfo(ip) {
    let url = `https://ipinfo.io/${ip}/geo?token=43f18b16f86ba4`
    let res = await fetch(url)
    let rep = await res.json()  
    return rep;
   
}

async function getPostalAddress(pincode) {
    let url = `https://api.postalpincode.in/pincode/${pincode}`
    let res = await fetch(url);
    let rep = await res.json();
    
    return rep;
    
}


function showGoogleMap(ipinfo) {
    const [lat, log] = ipinfo.loc.split(",");
    geolocation(ipinfo)    
    let map = document.getElementById("map-content")
    map.innerHTML = `<iframe width="100%" height="300px" src="https://maps.google.com/maps?q=${lat},${log}&output=embed"></iframe>`
};

function geolocation(ipinfo){
    let content = document.getElementById("content")
   
    let mapData ="";
    const [lat, log] = ipinfo.loc.split(",");
    mapData = `
    <div>
        <h1>My Public IP Address:  ${ipinfo.ip}</h1>
        <div class="data">
            <div>
               <div>lat: ${lat}</div><br>
               <div>lat: ${log}</div><br>
            </div>
            <div>
                <div>City: ${ipinfo.city}</div><br>
                <div>Region: ${ipinfo.region}</div><br>
            </div>
            <div>
                <div>Organistion:  ${ipinfo.org}</div><br>
                <div>Hostname:  ${window.location.hostname}</div><br>
            </div>
        </div>
    </div>    
    `
    content.innerHTML = mapData
}


function showTimeZone(ipinfo, postalData){
    showData(ipinfo, postalData)
    branchData(postalData[0].PostOffice)
}

function showData(info, postalData){
    console.log(postalData);
    let host = ""
    let data = document.getElementById("data-content");
    
    host = `
    <div>
        <div class="data-1">       
           <div>TimeZone: ${info.timezone} </div><br>
           <div>Date and Time: ${new Date()}</div><br>
           <div>Pincode : ${info.postal}</div><br>
           <div>Massage: ${postalData[0].Message}</div> <br>       
        </div>
    </div>
    <div class="search">
    
       <input type="search" onchange="search()" placeholder="filter"/>
    
    </div>    
    `
    data.innerHTML = host;
}

function search(e){
    console.log("adfasdf");
    var newArr = postalData[0].PostOffice.filter((item) =>
        item.Name
            .toLowerCase()
            .includes(e.target.value.trim().toLowerCase())
    );
    branchData(newArr);
}


function branchData(data){
    let getData = document.getElementById("get-data")
    let html = '';

    data.forEach((item, index)=>{

        html +=`
            <div class="item-data">
                <div>                
                    <div>Name : ${item.Name}</div><br>
                    <div>Branch Type : ${item.BranchType}</div><br>
                    <div>DeliveryStatus: ${item.DeliveryStatus}</div><br>
                    <div>District : ${item.District}</div><br>
                    <div>Division : ${item.Division}</div><br>            
                </div>
            </div>
        
        `
    })

    getData.innerHTML = html;


}