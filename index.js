const prayerTimes = document.getElementById("pray")
const month = document.getElementById('tb')
const screen = document.querySelector(".months")
const prays = document.getElementById('prays')
const timesItem = document.getElementById('all')
let selects = document.getElementById('selecting')
let Today = `https://api.aladhan.com/v1/timingsByCity?city=andijan&country=uzbekistan`
let monthly = `https://islomapi.uz/api/monthly?region=${selects.value}&month=2`
let kun = `https://islomapi.uz/api/present/day?region=andijon`


async function getdas(kun) {
    let res = await fetch(kun)
    let database = await res.json()
    return database
}

async function getTimes(Today) {
    let res = await fetch(Today)
    let database = await res.json()
    return database
}


async function RenderHTMLS(api) {
    let data = await getTimes(api)


    screen.innerHTML = `
    <span class="dates">
     <h1>${data.data.date.gregorian.month.en}</h1>
     <h1>${data.data.date.gregorian.year}</h1>
     </span>
     <h1>${data.data.date.hijri.month.en}  ${data.data.date.hijri.year}</h1>
     `

    prays.innerHTML = `
 
</div>
    <div class="pr-t">
        
        <div class="background br1">
    
</div>
        <div class="ex-pt">
            <span>${data.data.date.hijri.month.number} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} ${data.data.date.hijri.designation.abbreviated}</span>
            <span>${data.data.date.gregorian.weekday.en} ${data.data.date.readable}</span>
        </div>
    
        <div class="background br2">
    
</div>
    </div>
    `

}
async function RenderHTML(api) {
    let data = await getdas(api)



    const date = new Date();
    const timing = date.toTimeString().split(' ')[0].split(':');

    document.getElementById('current_time').innerHTML = timing

    const times = [
        `${data.times.tong_saharlik}`,
        `${data.times.quyosh}`,
        `${data.times.peshin}`,
        `${data.times.asr}`,
        `${data.times.shom_iftor}`,
        `${data.times.hufton}`,
        `${data.times.tong_saharlik}`
    ];




    const timeBlocks = ['Bomdodgacha', 'Quyoshgacha', 'Peshingacha', 'Asrgacha', 'Shomgacha', 'Xuftongacha', `Ertangi bomdodgacha`];

    function msToTime(s) {
        if (s < 0) s = -s;
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        hrs = hrs < 10 ? "0" + hrs : hrs;
        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;
        return hrs + ':' + mins + ':' + secs;
    }


    var currentTime = moment($("#current_time").text(), "HH:mm:ss");

    var period = 0;
    for (var i = 0; i < 6; i++) {
        if (currentTime.diff(moment(times[i], "HH:mm")) > 0) {
            period = i;
        }
        if (currentTime.diff(moment(times[5], "HH:mm")) > 0) {
            period++
        }
    }

    var time = times[period]
    var difference = currentTime.diff(moment(times[period], "HH:mm"))
    setInterval(() => {



        $("#current_time").text(currentTime.format("HH:mm:ss"));

        if (period === 6) {
            difference = moment(times[period], "HH:mm").add(1, 'days').diff(currentTime)
        } else {
            difference = currentTime.diff(moment(times[period], "HH:mm"))
        }

        currentTime = currentTime.add(1, "seconds");

        if (period > 0) {
            $(".ad__item").eq(period - 1).addClass(" active_time ");
        } else {
            $(".ad__item").eq(period).addClass(" active_time ");
        }
        if (currentTime.diff(moment(times[period], "HH:mm")) > 0) {
            if (period > 0) {
                if (period === 6) {
                    $(".ad__item").eq(period - 2).removeClass(" active_time ");
                } else {
                    $(".ad__item").eq(period - 1).removeClass(" active_time ");
                }
            } else {
                $(".ad__item").eq(period).removeClass(" active_time ");
            }
            period++
            period = period > 6 ? 6 : period;
        }
        // $("#remaining_time").innerHTML=""
        // $("#remaining_time").text(msToTime(difference))
        document.getElementById('remaining_time').textContent = msToTime(difference)
        $("#remaining_period").text(`${timeBlocks[period]} : `)
    }, 1000);

    
    timesItem.innerHTML +=`
    <span id="remaining_period"></span><span id="remaining_time" class=""></span>
    `

    prayerTimes.innerHTML = `
    <div class="box box1  ">
    <div class="cur-img">
    
    </div>
   
    <p><h1 class="nam" >Bomdod</h1></p>
    <span class="time" id="bomdod">${data.times.tong_saharlik}</span>
    

    
    </div>
    <div class="box box2 " >
    <div class="cur-img bx2">
    
    </div>
    <p><h1 class="nam" >Quyosh</h1></p>
    <span class="time" id="quyosh" >${data.times.quyosh}</span>
    </div>
    
    
    <div class="box box3 ">
    <div class="cur-img bx3">
    
    </div>
<p><h1 class="nam">Peshin</h1></p>
<span class="time" id="peshin" >${data.times.peshin}</span>
</div>


<div class="box box4 "  data-content="">
<div class="cur-img bx4">
    
    </div>
<p><h1  class="nam">Asr</h1></p>
<span class="time" id="asr">${data.times.asr}</span>
</div>


<div class="box box5  ">
<div class="cur-img bx5">
    
    </div>
<p><h1  class="nam">Shom</h1></p>
<span class="time" id="shom" >${data.times.shom_iftor}</span>

</div>


<div class="box box6  ">
<div class="cur-img bx6">
    
    </div>
<p><h1 class="nam" >Xufton</h1></p>
<span class="time" id="hufton" >${data.times.hufton}</span>

</div>

    `
}

$("#searchs").click(function () {
    let input = document.getElementById('search')
    // if(input.value === "toshkent" || "Toshkent"){
    //     input.value = "tashkent"
    // }
    // else if(input.value === "samarqand" || "Samarqand" ){
    //     input.value = "samarkand"
    // }
    // else if(input.value === "namangon" || "Namangon"){
    //     input.value = "namangan"
    // }
    // else if(input.value === "Andijon" || "andijon" ){
    //     input.value = "Andijan"
    // }
    // else if(input.value === "qoraqalpog'iston" || "Qoraqalpog'iston"){
    //     input.value = "nukus"
    // }
    // else if(input.value === "Farg'ona" ||  "farg'ona"){
    //     input.value = "Fergana"
    // }
    RenderMonth(`https://islomapi.uz/api/monthly?region=${input.value}&month=2`)

    RenderHTML(`https://islomapi.uz/api/present/day?region=${input.value}`)
    $('#search').val('')
})



document.getElementById('home').onclick = () => {
    $('.section-operation').css('display', "inline-block")
    $('.monthly').css('display', "inline-block")
    $('.prayer-times').css('display', "grid")
}
document.getElementById('homes').onclick = () => {
    $('.section-operation').css('display', "inline-block")
    $('.monthly').css('display', "inline-block")
    $('.prayer-times').css('display', "grid")
}
document.getElementById('select').onclick = () => {
    let select = document.getElementById('select')
    if (select.value === 'Daily') {
        $('.section-operation').css('display', "none")
        $('.monthly').css('display', "none")
        $('.st-opt').css('display', "none")
        $(".carousels").css('display', "none")
        $('.prayer-times').css('display', "grid")
    }
    else if (select.value === 'Monthly') {
        $('.section-operation').css('display', "none")
        $('.prayer-times').css('display', "none")
        $('.st-opt').css('display', "none")
        $(".carousels").css('display', "none")
        $('.monthly').css('display', "inline-block")
    }

}
document.getElementById('selects').onclick = () => {
    let selects = document.getElementById('selects')
    if (selects.value === 'Daily') {
        $('.section-operation').css('display', "none")
        $('.monthly').css('display', "none")
        $('.st-opt').css('display', "none")
        $(".carousels").css('display', "none")
        $('.prayer-times').css('display', "grid")
    }
    else if (selects.value === 'Monthly') {
        $('.section-operation').css('display', "none")
        $('.prayer-times').css('display', "none")
        $('.st-opt').css('display', "none")
        $(".carousels").css('display', "none")
        $('.monthly').css('display', "inline-block")
    }

}




async function GetMonth(monthly) {
    let res = await fetch(monthly)
    let database = await res.json()
    return database
}

async function RenderMonth(api) {
    let data = await GetMonth(api)
    month.innerHTML = ""
    data.forEach(async (e) => {
        let inf = await e
        if(inf.weekday === "Chorshanba"){
            inf.weekday = "Chor"
        }
        if(inf.weekday === "Payshanba"){
            inf.weekday = "Pay"
        }
        if(inf.weekday === "Juma"){
            inf.weekday = "Juma"
        }
        if(inf.weekday === "Shanba"){
            inf.weekday = "Shan"
        }
        if(inf.weekday === "Yakshanba"){
            inf.weekday = "Yak"
        }
        if(inf.weekday === "Dushanba"){
            inf.weekday = "Du"
        }
        if(inf.weekday === "Seshanba"){
            inf.weekday = "Se"
        }
        month.innerHTML += `
        <tr>
        <td class="day" >Kun</td>
        <td>Bomdod</td>
        <td>Quyosh</td>
        <td>Peshin</td>
        <td>Asr</td>
        <td>Shom</td>
        <td>Xufton</td>
        <td class="td">Region</td>
    </tr>
        <tr>
            <td class="day">${inf.day}.  ${inf.weekday}</td>
            <td>${inf.times.tong_saharlik}</td>
            <td>${inf.times.quyosh}</td>
            <td>${inf.times.peshin}</td>
            <td>${inf.times.asr}</td>
            <td>${inf.times.shom_iftor}</td>
            <td>${inf.times.hufton}</td>
            <td class="td">${inf.region}</td>
        </tr>
       
        `

    })
}

const image = {
    list: [
        "./images/part2.PNG", "./images/part3.PNG", "./images/part4.PNG"
    ],
    img: [
        "./images/part1.PNG"
    ]
}
const im = document.getElementById('im')
const bottom = document.getElementById('btm')

if ($('#one').click(function () {
    $('.parts').attr('src', "./images/part2.PNG")
}))
    if ($("#two").click(function () {
        $('.parts').attr('src', "./images/part3.PNG")
    }))
        if ($("#three").click(function () {
            $('.parts').attr('src', "./images/part4.PNG")
        }))

        $('.lines').click(function(){
            $('.extra').css({top: 0, right: 0, zIndex: 999})
          
        })
        $("#cancel").click(function(){
            $(".extra").css({top:0, right: -300, zIndex: 999})
        })

        document.getElementById('month-select').onclick = ()=>{
            let mon = document.getElementById('month-select')
            RenderMonth(`https://islomapi.uz/api/monthly?region=${selects.value}&month=${mon.value}`)
        }
            document.getElementById('selecting').onclick = () => {
                let select = document.getElementById('selecting')
                RenderHTML(`https://islomapi.uz/api/present/day?region=${select.value}`)
                RenderMonth(`https://islomapi.uz/api/monthly?region=${select.value}&month=2`)
                $('#search').val('')
            }

            if ($(window).width()<401) {
                $('#islamic1').attr('src', "./imagestwo/islamic1.PNG")
                $("#islamic2").attr("src", "./imagestwo/islamic2.PNG" )
                $("#islamic3").attr("src", "./imagestwo/islamic3.PNG" )
                $("#islamic4").attr("src", "./imagestwo/islamic4.PNG" )
                $("#islamic5").attr("src", "./imagestwo/islamic5.PNG" )
                $("#islamic6").attr("src", "./imagestwo/islamic6.PNG" )
             }

RenderHTMLS(Today)
RenderHTML(kun)
RenderMonth(monthly)


