
// defalt time
function fmtDate(d) {
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function fmtDateM(d) {
    month = '' + (d.getMonth() + 1),
    year = d.getFullYear();

if (month.length < 2) 
    month = '0' + month;

return [year, month].join('-');
}

var date = new Date();
var date_y = fmtDate(date);
var date_m = fmtDateM(date);
//let date_end = new Date(date.getFullYear(),date.getMonth()+1,date.getDate());
//console.log(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());
//$("#start").val(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());

$("#start").val(date_y);
$("#end").val(date_y);
$("#start-m").val(date_m);
$("#end-m").val(date_m);



function print_list(result){ 
	let rList = result;
	let listZone = $("#listZone");
	listZone.empty();
	if(rList.length == 0) {
		let txt = '<table class="table"><thead><tr><th>조회 내역이 없습니다.</th></tr></thead></table>';
		listZone.append(txt);
	}else{
		let sum1 = 0;
		let sum2 = 0;
		let txt = '<table class="table"><thead><tr><th>No.</th><th>카테고리</th><th>상품이름</th>'
		+'<th>구매개수</th><th>가격</th><th>쿠폰사용여부</th><th>상품금액</th><th>결제금액</th><th>구매일</th></tr></thead><tbody>';
	for (var i = 0; i < rList.length; i++) {
	        
		txt += '<tr>';
		txt += '<td><strong>'+(i+1)+'</strong></td>';
		txt += '<td> '+rList[i].category+' </td>';
		txt += '<td> '+rList[i].pname+'</td>';
		txt += '<td> '+rList[i].count+'</td>';
		txt += '<td> '+rList[i].price.toLocaleString()+'</td>';
		let cpn = (rList[i].coupon == true ? "O" : "X");
		txt += '<td> '+cpn+'</td>';
		txt += '<td> '+rList[i].total.toLocaleString()+'</td>';
		sum1 += rList[i].total;
		let pay = (rList[i].coupon == true ? rList[i].total-3000 : rList[i].total);
		txt += '<td> '+pay.toLocaleString()+'</td>';
		sum2 += pay;
		txt += '<td> '+rList[i].regdate+'</td>';
	}
		txt += '<tr><td></td><td></td><td></td>'
			+'<td></td><td></td><td><strong>총액</strong></td><td><strong>'+sum1.toLocaleString()+'</strong></td><td><strong>'
			+ sum2.toLocaleString() + '</strong></td><td></td></tr></tbody>';
		listZone.append(txt);
	}
}


function list_rpt(){ 
	
	
	//let pgIdx = pageIdx > 1 ? pageIdx : 1;
	let category = $("#cate").val();
	let stt = $("#start").val();
	let end = $("#end").val();
	
	i=0;
	while(i<2){
	stt=stt.replace("-","");
	end=end.replace("-","");
	i++;
	}
	stt = stt+"000000";
	end = end+"235959";
		
	$.getJSON("/report/list/"+category+"/"+stt+"/"+end+".json", function(result) {
		print_list(result);
	}).fail(function(jqxhr, textStatus, error) {
			alert("리스트 로딩 오류")
	       var err = "<Request Fail> textStatus: "+textStatus + ", error: " + error;
	   }).always(function(result){
	   });
}

function print_list2(result){ 
	let rList1 = $(result).find("List"); //list object 찾음
	let rList2 = $(result).find("List")[0]; //기본적으로 첫째 index
	let rList3 = $(rList2).find("item"); // 들어가보니 item에 정보가 담김.
	console.log(typeof(rList));
	console.log(rList1);
	console.log(rList2);
	console.log(rList3);
	let listZone = $("#listZone");
	listZone.empty();
	if(rList3.length == 0) {
		let txt = '<table class="table"><thead><tr><th>조회 내역이 없습니다.</th></tr></thead></table>';
		listZone.append(txt);
	}else{
		let cnt_list = [];
		let prc_list = [];
		let name_list = [];
		let txt = '<table class="table"><thead><tr><th>Rank</th><th>상품이름</th>'
		+'<th>판매개수</th><th>금액합계</th><th>금액합계(쿠폰적용)</th><th>쿠폰사용개수</th></tr></thead><tbody>';
		let sum1=0;
		let sum2=0;
		let sum3=0;
		i=0;
	for (let list of rList3) {
		let name = $(list).find("pname").text();
		let cnt = parseInt($(list).find("count").text());
		//let prc = parseInt($(list).find("price").text());
		let cpn = parseInt($(list).find("coupon").text());
		let ttl = parseInt($(list).find("total").text());
		let pno = parseInt($(list).find("pno").text());
		
		txt += '<tr>';
		txt += '<td><strong>'+(i+1)+'</strong></td>';
		txt += '<td><a onclick="cht_one('+pno+');"> '+name+'</a></td>';
		txt += '<td> '+cnt.toLocaleString()+'</td>';
		//txt += '<td> '+prc.toLocaleString()+'</td>';
		txt += '<td> '+ttl.toLocaleString()+'</td>';
		txt += '<td> '+(ttl-(3000*cpn)).toLocaleString()+'</td>';
		txt += '<td> '+cpn.toLocaleString()+'</td>';
		i++;
		sum1 += cpn;
		sum2 += ttl;
		sum3 += cnt
		
		cnt_list.push(cnt);
		prc_list.push(ttl);
		name_list.push(name);
	}
	sum_cpn = sum1 * 3000;	
	txt += '<tr><td><strong>총</strong></td><td></td>'
			+'<td><strong>'+sum3.toLocaleString()+'</strong></td><td><strong>'
			+ sum2.toLocaleString() +'</strong></td><td><strong>'
			+ (sum2 - sum_cpn).toLocaleString() +'</strong></td><td><strong>'
			+ sum1.toLocaleString()+' (발급액: '+sum_cpn.toLocaleString()
			+')</strong></td></tr></tbody>';
		listZone.append(txt);
		//console.log(cnt_list);
		print_Bcht(cnt_list,prc_list,name_list);
		
	}
}


function list_rpt2(){
	let prd = $("#product").val();
	let stt = $("#start-m").val();
	let end = $("#end-m").val();
	stt=stt.replace("-","");
	end=end.replace("-","");
	//stt = stt+"01"; java에서 day 지정로직넣기로 함.
	//end = end+"31";
		
	rpt_obj = {category:prd, start:stt, end:end};
	$.ajax({
		url:"/report/list/",
		type:"post",
		data: JSON.stringify(rpt_obj),
		contentType:"application/json; charset=utf-8"
	}).done(function(result){
		console.log(result);
		print_list2(result);
	}).fail(function(jqxhr, textStatus, error){
		alert("리스트 로딩 오류")
	       var err = "<Request Fail> textStatus: "+textStatus + ", error: " + error;
	}).always(function(){
	}); 
}



$(document).on("click", "#caList", function(e){
    e.preventDefault();
    list_rpt();
 });
 
$(document).on("click", "#proList", function(e){
    e.preventDefault();
    list_rpt2();
 });
 
$(document).on("click", "#reset", function(e){
    e.preventDefault();
    $("#listZone").text("");
    $("#chBar").text("");
 });



$(document).on("change", "#select", function(e){
			e.preventDefault();
	if($("#select").val() == 'ca'){
		$("#cate").show();
		$("#product").hide();
		$("#date-d").show();
		$("#date-m").hide();
		$("#caList").show();
		$("#proList").hide();
		$(".chart").attr("style","display:none");
		$("#listZone").attr("style","height: 85vh");
	}else{
		$("#cate").hide();
		$("#product").show();
		$("#date-d").hide();
		$("#date-m").show();
		$("#caList").hide();
		$("#proList").show();
		$(".chart").attr("style","display:block");
		$("#listZone").attr("style","height: 50vh");
	}
	});	
 
$(function(){
	$("#product").hide();
	$("#date-m").hide();
	$("#proList").hide();
	}); 
 
 
 
 
//차트관련 js 
 
function cht_one(pno){
	//최근 6개월의 1개상품 카운트 및 ttl 출력
	let this_m = date_m.replace("-","");
	console.log(this_m);
	
	info = {end: this_m};
	
	//put 방식 활용
	$.ajax({
		url:"/report/list/"+pno+"/",
		type:"put",
		data: JSON.stringify(info),
		contentType:"application/json; charset=utf-8"
	}).done(function(result){
		console.log(result);
		print_Lcht(result);
	}).fail(function(){
		alert("리스트 리딩 실패");
	}).always(function(){
	});
	
	
}
 
 
/* chart.js chart examples */

//chart colors
var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d','#dcb4cb',
	'#eddc22'];
//파,녹,차콜,연두,빨강,회색,분홍,노랑






function print_Lcht(result){

	month = date.getMonth()+1;
	console.log(month);
	year =  date.getFullYear();
	let list_month = [];
	/* 오늘부터 6개월전은? */
		if (month<6){
			let m = 12 + month - 5
			year--;
			for (var i = m; i <= 12; i++) {
				list_month.push(year+"-"+i);
			}
			year++;
			for (var i = 1; i <= month; i++) {
				list_month.push(year+"-"+i);
			}
		}else{
			let m = month - 5;
			for (var i = m; i <= month; i++) {
				list_month.push(year+"-"+i);
			}
		}
	console.log(list_month);
	let rList = $(result).find("item");
	//console.log(rList);
	//console.log(rList[0].length);
	//console.log(rList[0]["total"]);
	//console.log(rList[5].length);
	//console.log(rList[5][5]);
	let list_ttl = [];
	let list_ttl2 = [];
	for (let rvo of rList) {
		let ttl = ($(rvo).find("total").length==0?0:parseInt($(rvo).find("total").text()));
		let cnt = ($(rvo).find("coupon").length==0?0:parseInt($(rvo).find("coupon").text()));
		let ttl2 = ttl - (cnt*3000);
		list_ttl.push(ttl);
		list_ttl2.push(ttl2);
	}
	console.log(list_ttl);
	console.log(list_ttl2);
	
	/* large line chart */
	var chLine = document.getElementById("chLine");
	var chartData = {
	labels: list_month,
	datasets: [
	/* {
	 data: [500,400,300,299,345,560,800],
	 backgroundColor: 'transparent',
	 borderColor: colors[2],
	 borderWidth: 4,
	 pointBackgroundColor: colors[1]
	}, */
	{
	 data: list_ttl,
	 backgroundColor: 'transparent',
	 borderColor: colors[0],
	 borderWidth: 4,
	 pointBackgroundColor: colors[0]
	},
	{
	  data: list_ttl2,
	  backgroundColor: colors[3],
	  borderColor: colors[1],
	  borderWidth: 4,
	  pointBackgroundColor: colors[1]
	}
	
	]
	};
	if (chLine) {
	new Chart(chLine, {
	type: 'line',
	data: chartData,
	options: {
	 scales: {
	   xAxes: [{
	     ticks: {
	       beginAtZero: false
	     }
	   }]
	 },
	 legend: {
	   display: false
	 },
	 responsive: true
	}
	});
	}
}
/* bar chart */

function print_Bcht(cnt_list,prc_list,name_list){
	$(".chBar").html('<canvas id="chBar"></canvas>');
	var chBar = document.getElementById("chBar");
	if (chBar) {
	new Chart(chBar, {
	type: 'bar',
	data: {
	 labels: name_list,
	 datasets: [{
	   label : 'count',
	   data: cnt_list,
	   backgroundColor: colors[7]
	 },
	 {
		 label : 'price',
	   data: prc_list,
	   backgroundColor: colors[1]
	 }]
	},
	options: {
	 legend: {
	   display: true
	 },
	 scales: {
	   xAxes: [{
	     barPercentage: 0.5,
	     categoryPercentage: 0.5
	   }],
	   yAxes: [{
			ticks: {
				beginAtZero: true,
			}
	 }]
	}
	}
	});
	}
}







 
