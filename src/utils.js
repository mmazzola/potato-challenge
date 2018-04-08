export function getPublishedDate(sdate){
  let date = new Date(sdate)
  let dateString = [dayOfTheMonth(date) , monthShortName(date), date.getFullYear(),"at" , date.getHours()+":"+date.getMinutes()].join(" ")
  return dateString;
}

function dayOfTheMonth(date){
    var dateString = date.getDate().toString();
    let lastChar = dateString.charAt(dateString.length-1)
    if(lastChar === "1"){
      dateString +="st"
    }
    else if(lastChar === "2"){
      dateString +="nd"
    }
    else if(lastChar === "3"){
      dateString +="rd"
    }else{
      dateString +="th"
    }
    return dateString;
  }
  
function monthShortName(date){
    var months = ["Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]
    return months[date.getMonth()]
  }