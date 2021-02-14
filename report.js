

// defalt time
function r_fmtDate(d) {
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function r_fmtDateM(d) {
    month = '' + (d.getMonth() + 1),
    year = d.getFullYear();

if (month.length < 2) 
    month = '0' + month;

return [year, month].join('-');
}

var date = new Date();
var date_y = r_fmtDate(date);
var date_m = r_fmtDateM(date);
//let date_end = new Date(date.getFullYear(),date.getMonth()+1,date.getDate());
//console.log(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());
//$("#start").val(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());

$("#start").val(date_y);
$("#end").val(date_y);
$("#start-m").val(date_m);
$("#end-m").val(date_m);

var cnt_cpn = 0;

function r_print_list(result){ 
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
		+'<th>구매개수</th><th>가격</th><th>쿠폰사용여부</th><th>상품금액</th><th></th><th>구매일</th></tr></thead><tbody>';
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
		//let pay = (rList[i].coupon == true ? rList[i].total-3000 : rList[i].total);
		//txt += '<td> '+pay.toLocaleString()+'</td>';
		//sum2 += pay;
		txt += '<td> '+rList[i].regdate+'</td>';
	}
		txt += '<tr><td></td><td></td><td></td>'
			+'<td></td><td></td><td><strong>총액</strong></td><td><strong>'+sum1.toLocaleString()+'</strong></td><td><strong>'
			+ cnt_cpn.toLocaleString()+'(기간중 쿠폰사용개수)' 
			+ '</strong></td><td></td></tr></tbody>';
		listZone.append(txt);
	}
}


function r_list_rpt(){ 
	
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
	
	$.getJSON("/report/coupon/"+stt+"/"+end+".json", function(result) {
		cnt_cpn = result;
	}).fail(function() {
			alert("쿠폰 개수 카운트 오류")
	   }).always(function(result){
	   });
	
	$.getJSON("/report/list/"+category+"/"+stt+"/"+end+".json", function(result) {
		r_print_list(result);
	}).fail(function(jqxhr, textStatus, error) {
			alert("리스트 로딩 오류")
	       var err = "<Request Fail> textStatus: "+textStatus + ", error: " + error;
	   }).always(function(result){
	   });
}

function r_print_list2(result){ 
	//console.log(result);
	
	//let rList1 = $(result).find("List"); //list object 찾음
	//let rList2 = $(result).find("List")[0]; //기본적으로 첫째 index
	//let rList3 = $(rList2).find("item"); // 들어가보니 item에 정보가 담김.
	let rList1 = $($(result).find("rList1")[0]).find("rList1");
	let rList2 = $($(result).find("rList2")[0]).find("rList2");
	let rList1_list = [];
	let rList2_list = [];
	
	for(let rvo of rList1){
		rList1_list.push(rvo);
	}
	for(let rvo of rList2){
		rList2_list.push(rvo);
	}
	
	//console.log(rList1_list);
	//console.log(rList1_list.length);
	//console.log($(rList1_list[0]).find("pno").text());
	
	let listZone = $("#listZone");
	listZone.empty();
	if(rList1_list == 0) {
		let txt = '<table class="table"><thead><tr><th>조회 내역이 없습니다.</th></tr></thead></table>';
		listZone.append(txt);
	}else{
		let cnt_list = [];
		let prc_list = [];
		let name_list = [];
		let txt = '<table class="table"><thead><tr><th>Rank</th><th>상품이름</th>'
		+'<th>판매개수</th><th>금액합계</th><th>';
		if($("#product").val()=='sld'){
			txt += '매출비율';
		}else{
			txt += '판매비율';	
		}
		txt += '</th><th>전월실적</th><th>증감률</th></tr></thead><tbody>';
		let sum1=0;
		let sum_ttl=0;
		let sum_cnt=0;
	
	for(let list of rList1){
		let cnt = parseInt($(list).find("count").text());
		let ttl = parseInt($(list).find("total").text());
		sum_ttl += ttl;
		sum_cnt += cnt;
	}	
		
	//console.log($(rList1_list[0]).find("pno"));
	//console.log(($(rList1_list[0]).find("pno").text()));
	
	
	//for (let list of rList3) {
	for (let i=0; i< rList1_list.length;i++) {
	
		let name = $(rList1_list[i]).find("pname").text();
		let cnt = parseInt($(rList1_list[i]).find("count").text());
		let cpn = parseInt($(rList1_list[i]).find("coupon").text());
		let ttl = parseInt($(rList1_list[i]).find("total").text());
		let pno = parseInt($(rList1_list[i]).find("pno").text());
		
		let ttl2 = parseInt($(rList2_list[i]).find("total").text());
		let cnt2 = parseInt($(rList2_list[i]).find("count").text());
		
		ttl2=isNaN(ttl2)?"X":ttl2;
		cnt2=isNaN(cnt2)?"X":cnt2;
		
		
		console.log(ttl2);
		
		txt += '<tr>';
		txt += '<td><strong>'+(i+1)+'</strong></td>';
		txt += '<td><a onclick="r_cht_one('+pno+');"> '+name+'</a></td>';
		txt += '<td> '+cnt.toLocaleString()+'</td>';
		//txt += '<td> '+prc.toLocaleString()+'</td>';
		txt += '<td> '+ttl.toLocaleString()+'</td>';
		if($("#product").val()=='sld'){
			txt += '<td> '+(ttl * 100 / sum_ttl).toFixed(2).toLocaleString()+' %</td>';
			txt += '<td> '+ttl2.toLocaleString()+' </td>';
			txt += '<td style="color:'+(((ttl2=="X")||(ttl==ttl2))?'black':(ttl-ttl2<0?'blue':'red'))+'"> '
			+((ttl2=="X")?"-":((ttl-ttl2)*100/ttl).toFixed(2).toLocaleString()+' %')+'</td>';
		}else{
			txt += '<td> '+(cnt * 100 / sum_cnt).toFixed(2).toLocaleString()+' %</td>';
			txt += '<td> '+cnt2.toLocaleString()+' </td>';
			txt += '<td style="color:'+(((cnt2=="X")||(cnt==cnt2))?'black':(cnt-cnt2<0?'blue':'red'))+'"> '
			+((cnt2=="X")?"-":((cnt-cnt2)*100/cnt).toFixed(2).toLocaleString()+' %')+'</td>';	
		}
		sum1 += cpn;
		
		cnt_list.push(cnt);
		prc_list.push(ttl);
		name_list.push(name);
	}
	sum_cpn = cnt_cpn * 3000;	
	txt += '<tr><td><strong>Total</strong></td><td></td>'
			+'<td><strong>'+sum_cnt.toLocaleString()+'</strong></td><td><strong>'
			+ sum_ttl.toLocaleString() +'</strong></td><td><strong>'
			//+ (sum_ttl - sum_cpn).toLocaleString() 
			+'</strong></td><td><strong>'
			//+ cnt_cpn.toLocaleString()+' (발급액: '+sum_cpn.toLocaleString()+')'
			+'</strong></td></tr></tbody>';
		listZone.append(txt);
		//console.log(cnt_list);
		r_print_Bcht(cnt_list,prc_list,name_list);
		
	}
}


function r_list_rpt2(){
	let prd = $("#product").val();
	let stt = $("#start-m").val();
	let end = $("#end-m").val();
	stt=stt.replace("-","");
	end=end.replace("-","");
	//stt = stt+"01"; java에서 day 지정로직넣기로 함.
	//end = end+"31";
	
	console.log("날짜 확인 : " +stt+','+end);
	
	$.getJSON("/report/coupon/"+stt+"/"+end+".json", function(result) {
		cnt_cpn = result;
	}).fail(function() {
			alert("쿠폰 개수 카운트 오류")
	   }).always(function(){
	   });
	
	rpt_obj = {category:prd, start:stt, end:end};
	$.ajax({
		url:"/report/list/",
		type:"post",
		data: JSON.stringify(rpt_obj),
		contentType:"application/json; charset=utf-8"
	}).done(function(result){
		r_print_list2(result);
	}).fail(function(jqxhr, textStatus, error){
		alert("리스트 로딩 오류")
	       var err = "<Request Fail> textStatus: "+textStatus + ", error: " + error;
	}).always(function(){
	}); 
}



$(document).on("click", "#caList", function(e){
    e.preventDefault();
    r_list_rpt();
 });
 
$(document).on("click", "#proList", function(e){
    e.preventDefault();
	$("#r-comment").show();
    r_list_rpt2();
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
	$("#r-comment").hide();
	}); 
 
 
 
 
//차트관련 js 
 
function r_cht_one(pno){
	//최근 6개월의 1개상품 카운트 및 ttl 출력
	let this_m = date_m.replace("-","");
	console.log(this_m);
	info = {end: this_m};
	
	$("#r-comment").hide();
	
	//put 방식 활용
	$.ajax({
		url:"/report/list/"+pno+"/",
		type:"put",
		data: JSON.stringify(info),
		contentType:"application/json; charset=utf-8"
	}).done(function(result){
		console.log(result);
		r_print_Lcht(result);
	}).fail(function(){
		alert("리스트 리딩 실패");
	}).always(function(){
	});
	
	
}
 
 

//chart colors
var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d','#dcb4cb',
	'#eddc22','#ff4949'];
//파0,녹1,차콜2,연두3,빨강4,회색5,분홍6,노랑7,진홍8


function r_print_Lcht(result){

	month = date.getMonth()+1;
	console.log(month);
	year =  date.getFullYear();
	let list_month = [];
	// 오늘부터 6개월전 날짜
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
	//console.log(list_month);
	let rList = $(result).find("item");
	//console.log(rList);
	//console.log(rList[0].length);
	//console.log(rList[0]["total"]);
	//console.log(rList[5].length);
	//console.log(rList[5][5]);
	let list_ttl = [];
	let list_ttl2 = [];
	let list_cpn = [];
	
	for (let rvo of rList) {
		let ttl = ($(rvo).find("total").length==0?0:parseInt($(rvo).find("total").text()));
		let cnt = ($(rvo).find("coupon").length==0?0:parseInt($(rvo).find("coupon").text()));
		//let ttl2 = ttl - (cnt*3000);
		list_ttl.push(ttl);
		//list_ttl2.push(ttl2);
		list_cpn.push(cnt);
	}
	console.log(list_ttl);
	//console.log(list_ttl2);
	console.log(list_cpn);
	
  	// 회귀 x를 금액합계, y를 쿠폰양  
	let xy_sum = 0;
	let x_sum = 0;
	let y_sum = 0;
	let x2_sum = 0;
	for (var i = 0; i < list_ttl.length; i++) {
		xy = list_ttl[i] * list_cpn[i];
		x2 = list_ttl[i] * list_ttl[i];
		x_sum += list_ttl[i];
		y_sum += list_cpn[i];
		xy_sum += xy;
		x2_sum += x2;
	}
	
	// 상관계수
	let x_mean = x_sum / list_ttl.length;
	let y_mean = y_sum / list_ttl.length;
	let xmym_sum = 0;
	let xmsq_sum = 0;
	let ymsq_sum = 0;
	for(var i = 0; i< list_ttl.length; i++){
		xmym_sum += (list_ttl[i] - x_mean)*(list_cpn[i] - y_mean);
		xmsq_sum += Math.pow(list_ttl[i] - x_mean,2);
		ymsq_sum += Math.pow(list_cpn[i] - y_mean,2);
	}
	
	let r = xmym_sum / (Math.sqrt(xmsq_sum) * Math.sqrt(ymsq_sum))
	let r2 = Math.pow(r,2);
	
	let t_dist = r*(Math.sqrt(4/(1-r2))); //표본크기6에 대한 자유도 4
	
	console.log('상관계수: ' + r);
	console.log('결정계수: ' + r2);
	console.log('t분포: '+ t_dist);

	if(t_dist<2.13){
		$("#pvalue").text("(95% 미만)");
		$("#pvalue").attr("style","color:red");
	}else if(t_dist<3.75){
		$("#pvalue").text("(95%~99% 신뢰구간)");
		$("#pvalue").attr("style","color:#dcb518");
	}else{
		$("#pvalue").text("(99% 이상)");
		$("#pvalue").attr("style","color:blue");
	}	
	// 예측선
	let sxy = xy_sum - (x_sum * y_sum)/list_ttl.length;
	let sxx = x2_sum - (x_sum * x_sum)/list_ttl.length;
	let b = sxy / sxx;
	let a = (y_sum/list_ttl.length) - (b * (x_sum/list_ttl.length));
	
	let x_pred = ((y_sum/list_ttl.length) - a) / b;
	
	console.log(y_sum/list_ttl.length);
	console.log(x_pred);
	
	list_month.push("다음달 예상");
	list_ttl.push(x_pred);
	//list_ttl2.push(x_pred - (3000*((y_sum/list_ttl.length))));
	
	
	$("#sixmnt").text($(rList[0]).find("pname").text());
	
	$(".chLine").html('<canvas id="chLine"></canvas>');
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
	 pointBackgroundColor: [colors[0],colors[0],colors[0],colors[0],colors[0],colors[0],colors[8]],
	 pointRadius:4
	},
	{
	  data: list_ttl2,
	  backgroundColor: colors[3],
	  borderColor: colors[1],
	  borderWidth: 4,
	  pointBackgroundColor: colors[1],
	  pointDot: true,
		 pointDotRadius : 1,
		 pointDotStrokeWidth : 5
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
	   }],
	   yAxes:[{
	     ticks: {
	       beginAtZero: false,
		   callback: function(label, index, labels) {
                        return label.toLocaleString();
					}
	     }
	   }]
	 },
	 legend: {
	   display: false
	 },
	 responsive: true,
	}
	});
	}
}

function r_print_Bcht(cnt_list,prc_list,name_list){
	$(".chBar").html('<canvas id="chBar"></canvas>');
	var chBar = document.getElementById("chBar");
	if (chBar) {
	new Chart(chBar, {
	type: 'bar',
	data: {
	 labels: name_list,
	 datasets: [{
	   label : '판매량',
	   data: cnt_list,
	   backgroundColor: colors[7]
	 },
	 {
		 label : '매출량',
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
		 		callback: function(label, index, labels) {
                        return label.toLocaleString();
					}
			}
	 }]
	}
	}
	});
	}
}





 
