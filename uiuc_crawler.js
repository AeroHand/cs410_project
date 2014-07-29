tbody = document.getElementsByTagName('tbody');
table = tbody.item(0);
var baseUrl = "https://my.illinois.edu"

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

var fileCounter = 0;
for(i = 0 ; i < table.rows.length; i++)
{
	var categoryUrl = table.rows[i].cells[1].getElementsByTagName('a').item(0).href;
	console.log(categoryUrl);

	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", categoryUrl, false );
	xmlHttp.send( null );
	var content = xmlHttp.responseText;
	table1Start = content.indexOf("<tbody>");
	table1End = content.indexOf("</tbody>") + 8;
	var table1 = content.substring(table1Start, table1End);
	console.log("--------------------------------------------");
	do
	{
		trStart = table1.indexOf("<tr>");
		if(trStart  < 0) break;
		trEnd = table1.indexOf("</tr>") + 5;
		var tr = table1.substring(trStart, trEnd);
		table1 = table1.replace(tr, "")
		tdStart = tr.indexOf("href=") + 6;
		var trHref = tr.substring(tdStart);
		tdEnd = trHref.indexOf(">") - 1;
		var courseUrl = trHref.substring(0, tdEnd);
		console.log(fileCounter + ": " + baseUrl + courseUrl);

		courseXmlHttp = new XMLHttpRequest();
		courseXmlHttp.open( "GET", courseUrl, false );
		courseXmlHttp.send( null );
		var contentCourse = courseXmlHttp.responseText;		
		var fulCourseUrl = baseUrl + courseUrl;
		var data = {__url: fulCourseUrl, __desc: contentCourse },
			fileName = "uiuc_"+ fileCounter + ".txt";

		saveData(data, fileName);
		fileCounter++;
		sleep(1000);
	}
	while(true);
	console.log("=====================================");
	sleep(1000);
}

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while(new Date().getTime() < unixtime_ms + ms) {}
}