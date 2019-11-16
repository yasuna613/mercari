$(document).on('turbolinks:load',function(){

$(function(){
  
  $('input[type="input"]').on('input',function(){
    check_num($(this)); //入力する値を制限
});
});

// １．グローバル変数（一時的に保存しておく）を宣言
var _chknum_value = "";

function check_num(obj){
  // ２．変数の定義
  var txt_obj = $(obj).val();
  var txt_obj_change = txt_obj.replace(/[０-９]/g,function(s){return String.fromCharCode(s.charCodeAt(0)-0xFEE0)});
  var text_length = txt_obj.length;
  
  // ３．入力した文字が数字かどうかチェック
  if(txt_obj.match(/^[0-9０-９]+$/)){
         //全角を半角に変換
        if(txt_obj.match(/[０-９]/g)){
          _chknum_value = $(obj).val(txt_obj_change);
      }else{
            _chknum_value = txt_obj;
      }
  }else{
       // ３．２．入力した文字が数字ではないとき
       if(text_length == 0){
            _chknum_value = "";
       }else{
            $('input[type="input"]').val(_chknum_value);
       }
  }

  $(function(){
    $("#price_calc").keyup(function(){

    var data = $(this).val();
    var fee = Math.floor(data * 0.1);
    var profit = Math.floor(data - fee);
    
    // 価格設定300円〜9,999,999円
    if (data > 299 && data < 10000000 ) {
      $(".right_bar").text("¥" + fee.toLocaleString('ja-JP'));
      $(".right_bar_2").text("¥" + profit.toLocaleString('ja-JP'));
    } else {
      $(".right_bar").text("-");
      $(".right_bar_2").text("-");
    }
  });
});
}

//複数画像のアップロード機能
$(document).on('turbolinks:load', function(){
  var dropzone = $('.dropzone-area');
  var images = [];
  var inputs  =[];
  var input_area = $('.input_area');
  var preview = $('#preview');

  $(document).on('change', 'input[type= "file"].upload-image',function() {
    var file = $(this).prop('files')[0];
    var reader = new FileReader();
    inputs.push($(this));
    var img = $(`<div class="sp_sell-upload-item"><figure class="sp_sell-upload-image"><img height="116" width="113"  alt class/></figure>`);//アップロードされたイメージにclass&idを付与
    reader.onload = function(e) {
      var btn_wrapper = $('<div class="sp_sell-upload-button"><a class="sp_sell-upload-edit", style="cursor:pointer">編集</a><a class="sp_sell-upload-delite", style="cursor:pointer">削除</a></div></div>');//アップロードされたイメージの下にボタンを付与
      img.append(btn_wrapper);
      img.find('img').attr({
        src: e.target.result
      })
    }
    reader.readAsDataURL(file);
    images.push(img);


        $('#preview').empty();
        $.each(images, function(index, image) {
          image.attr('data-image', index);
          preview.append(image);
        })

    if(images.length == 10) {
      dropzone.css({
        'display': 'none'
      })
      return;
    }
    var new_image = $(`<input multiple= "multiple" name="images[image_url][]" class="upload-image" data-image= ${images.length} type="file" id="upload-image" style="display: none;">`);
    input_area.prepend(new_image);
  });
  $(document).on('click', '.sp_sell-upload-delite', function() {
    var target_image = $(this).parent().parent();
    $.each(inputs, function(){
      if ($(this).data('image') == target_image.data('image')){
        $(this).remove();
        target_image.remove();
        var num = $(this).data('image');
        images.splice(num, 1);
        inputs.splice(num, 1);
        if(inputs.length == 0) {
          $('input[type= "file"].upload-image').attr({
            'data-image': 0
          })
        }
      }
    })
    $('input[type= "file"].upload-image:first').attr({
      'data-image': inputs.length
    })
    $.each(inputs, function(index) {
      var input = $(this)
      input.attr({
        'data-image': index
      })
      $('input[type= "file"].upload-image:first').after(input)
    })

      $.each(images, function(index, image) {
        image.attr('data-image', index);
        preview.append(image);

        if(images.length < 10) {
          dropzone.css({
            'display': 'block'
          })
        }
      })
      
  })
});


$(function(){
    $(window).scroll(function (){
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      if(scroll >= windowHeight/2) {
        $('.sp_sell-upload-drop-box').fadeOut();
      } else {
        $('.sp_sell-upload-drop-box').fadeIn();
      }
    });
  });
  


  $(function(){
  // カテゴリーセレクトボックスのオプションを作成
  function appendOption(category){
    var html = `<option value="${category.name}" data-category="${category.id}">${category.name}</option>`;
    return html;
  }
  // 子カテゴリーの表示作成
  function appendChidrenBox(insertHTML){
    var childSelectHtml = '';
    childSelectHtml = `<div class='listing-select-wrapper__added' id= 'children_wrapper'>
                        <div class='listing-select-wrapper__box'>
                          <select class="listing-select-wrapper__box--select" id="child_category" name="category_id">
                            <option value="---" data-category="---">---</option>
                            ${insertHTML}
                          </select>
                          <i class='fas fa-chevron-down listing-select-wrapper__box--arrow-down'></i>
                        </div>
                      </div>`;
    $('#sp_child-space').append(childSelectHtml);
  }
  // 孫カテゴリーの表示作成
  function appendGrandchidrenBox(insertHTML){
    var grandchildSelectHtml = '';
    grandchildSelectHtml = `<div class='listing-select-wrapper__added' id= 'grandchildren_wrapper'>
                              <div class='listing-select-wrapper__box'>
                                <select class= "listing-select-wrapper__box--select" id= "grandchild_category" name= "category_id" >
                                  <option value="---" data-category="---">---</option>
                                  ${insertHTML}
                                </select>
                                <i class='fas fa-chevron-down listing-select-wrapper__box--arrow-down'></i>
                              </div>
                            </div>`;
    $('#sp_grandchild-space').append(grandchildSelectHtml);
  }
  // 親カテゴリー選択後のイベント
  $('#parent_category').on('change', function(){
    var parentCategory = document.getElementById('parent_category').value; //選択された親カテゴリーの名前を取得
    if (parentCategory != "---"){ //親カテゴリーが初期値でないことを確認
      $.ajax({
        url: 'get_category_children',
        type: 'GET',
        data: { parent_name: parentCategory },
        dataType: 'json'
      })
      .done(function(children){
        $('#children_wrapper').remove(); //親が変更された時、子以下を削除するする
        $('#grandchildren_wrapper').remove();
        $('#size_wrapper').remove();
        $('#brand_wrapper').remove();
        var insertHTML = '';
        children.forEach(function(child){
          insertHTML += appendOption(child);
        });
        appendChidrenBox(insertHTML);
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      $('#children_wrapper').remove(); //親カテゴリーが初期値になった時、子以下を削除するする
      $('#grandchildren_wrapper').remove();
      $('#size_wrapper').remove();
      $('#brand_wrapper').remove();
    }
  });
  // 子カテゴリー選択後のイベント
  $('.listing-product-detail__category').on('change', '#child_category', function(){
    var childId = $('#child_category option:selected').data('category'); //選択された子カテゴリーのidを取得
    if (childId != "---"){ //子カテゴリーが初期値でないことを確認
      $.ajax({
        url: 'get_category_grandchildren',
        type: 'GET',
        data: { child_id: childId },
        dataType: 'json'
      })
      .done(function(grandchildren){
        if (grandchildren.length != 0) {
          $('#grandchildren_wrapper').remove(); //子が変更された時、孫以下を削除するする
          $('#size_wrapper').remove();
          $('#brand_wrapper').remove();
          var insertHTML = '';
          grandchildren.forEach(function(grandchild){
            insertHTML += appendOption(grandchild);
          });
          appendGrandchidrenBox(insertHTML);
        }
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      $('#grandchildren_wrapper').remove(); //子カテゴリーが初期値になった時、孫以下を削除する
      $('#size_wrapper').remove();
      $('#brand_wrapper').remove();
    }
  });
});


$(function(){
  
  // サイズセレクトボックスのオプションを作成
  function appendSizeOption(size){
    var html = `<option value="${size.name}">${size.name}</option>`;
    return html;
  }
  // サイズ入力欄の表示作成
  function appendSizeBox(insertHTML){
    var sizeSelectHtml = '';
    sizeSelectHtml = `<div class="listing-product-detail__size" id= 'size_wrapper'>
                        <label class="listing-default__label" for="サイズ">サイズ</label>
                        <span class='listing-default--require'>必須</span>
                        <div class='listing-select-wrapper__added--size'>
                          <div class='listing-select-wrapper__box'>
                            <select class="listing-select-wrapper__box--select" id="size" name="size_id">
                              <option value="---">---</option>
                              ${insertHTML}
                            </select>
                            <i class='fas fa-chevron-down listing-select-wrapper__box--arrow-down'></i>
                          </div>
                        </div>
                      </div>`;
    $('#sp_size-space').append(sizeSelectHtml);
  }
  // 孫カテゴリー選択後のイベント
  $('.listing-product-detail__category').on('change', '#grandchild_category', function(){
    var grandchildId = $('#grandchild_category option:selected').data('category'); //選択された孫カテゴリーのidを取得
    if (grandchildId != "---"){ //孫カテゴリーが初期値でないことを確認
      $.ajax({
        url: 'get_size',
        type: 'GET',
        data: { grandchild_id: grandchildId },
        dataType: 'json'
      })
      .done(function(sizes){
        $('#size_wrapper').remove(); //孫が変更された時、サイズ欄以下を削除する
        if (sizes.length != 0) {
        var insertHTML = '';
          sizes.forEach(function(size){
            insertHTML += appendSizeOption(size);
          });
          appendSizeBox(insertHTML);
        }
      })
      .fail(function(){
        alert('サイズ取得に失敗しました');
      })
    }else{
      $('#size_wrapper').remove(); //孫カテゴリーが初期値になった時、サイズ欄以下を削除する
    }
  });
});

$(function(){
  // ブランド入力欄の表示作成
  function appendBrandBox(){
    var brandSelectHtml = '';
    brandSelectHtml =  `<div class="sp_form-group" id="brand_wrapper">
                          <label type="search" list="data1" for="sp_input-field">ブランド
                            <span class="sp_form-arbitrary">任意</span>
                          </label>
                          <div>
                            <input name= "item[brand]" type= "search" class="sp_input-default" id="sp_input-field" autocomplete="off" value= "" placeholder= "例）シャネル", list= "keywords" >
                          </div>
                        </div>`;
    $('#sp_brand-space').append(brandSelectHtml);
  }
  // 孫カテゴリー選択後のイベント
  $('.listing-product-detail__category').on('change', '#grandchild_category', function(){
    var grandchildId = $('#grandchild_category option:selected').data('category'); //選択された孫カテゴリーのidを取得
    if (grandchildId != "---"){ //孫カテゴリーが初期値でないことを確認
        $('#brand_wrapper').remove(); //孫が変更された時、サイズ欄以下を削除する
          appendBrandBox();
    }else{
      $('#brand_wrapper').remove(); //孫カテゴリーが初期値になった時、サイズ欄以下を削除する
    }
  });
});

$(function(){
  var search_list = $(".brand-search-result");

  function appendKeywords() {
    var datalist = `<datalist id="keywords"></datalist>`
              search_list.append(datalist);
  }

  function appendBrands(brand) {
    if($("#sp_input-field").val() == brand.name){
      $(".brand-search-result").children().remove();
    }else{
    var html = `<option value="${ brand.name }" key="${ brand.id }" class="sp_search-result">${ brand.name }</option>`
    search_list.children().append(html);
  }}


 $("#sp_brand-space").on('keyup', 'input', function(){
  var input = $("#sp_input-field").val();
  var grandchildId = $('#grandchild_category option:selected').data('category'); //選択された孫カテゴリーのidを取得
  if (grandchildId != ""){ //孫カテゴリーが初期値でないことを確認
  $.ajax({
    url: "get_brand",
    type: 'GET',
    data: {keyword: input, grandchild_id: grandchildId},
    dataType: 'json'
  })
  .done(function(brands) {
    $(".brand-search-result").children().remove();
    if (brands.length !== 0) {
      appendKeywords();
      brands.forEach(function(brand){
        appendBrands(brand);
      });
    }else{
      $(".brand-search-result").children().remove();
    }
  })
  .fail(function(){
    $(".brand-search-result").children().remove();
    alert('名前検索に失敗しました。');
    })
  }
  });


  $(function(){
    function appendShip(ship){
      var html = `<option value="${ship.value}" data-category="${ship.key}">${ship.value}</option>`;
      return html;
    }
    // 配送方法入力欄の表示作成
    function appendHowToShipBox(how_to_pay){
      var brandSelectHtml = '';
      brandSelectHtml =  `<div class="listing-product-detail__size">
                            <label class= "listing-default__label" >配送の方法</label>
                            <span class='listing-default--require'>必須</span>
                            <div class='listing-select-wrapper__added--size'>
                              <div class='listing-select-wrapper__box'>
                                <select :how_to_ship class= "listing-select-wrapper__box--select" id= "size" name= "size_id" >
                                  <option value="---">---</option>
                                  ${how_to_pay}
                                  </select>
                                <i class='fas fa-chevron-down listing-select-wrapper__box--arrow-down'></i>
                              </div>
                            </div>
                          </div>`;
      $('#how-to-ship_wrapper').append(brandSelectHtml);
    }
    $('#sp_select-default-ship').on('change', function(){
      var shipmentoption = document.getElementById('sp_select-default-ship').value; 
      var paynow = [{key : "1" , value : "未定"}, {key : "2" , value : "らくらくメルカリ便"}, {key : "3" , value : "ゆうメール"}, {key : "4" , value : "レターパック"}, {key : "5" , value : "普通郵便(定形、定形外)"}, {key : "6" , value : "クロネコヤマト"}, {key : "7" , value : "ゆうパック"}, {key : "8" , value : "クリックポスト"}, {key : "9" , value : "ゆうパケット"}];
      var paylater = [{key : "10" , value : "未定"}, {key : "11" , value : "クロネコヤマト"}, {key : "12" , value : "ゆうパック"}, {key : "13" , value : "ゆうメール"}];
      if (shipmentoption != "---"){
          $('#how-to-ship_wrapper').empty(); 
          var insertHTML = '';
          if (shipmentoption === "送料込み(出品者負担)"){
            paynow.forEach(function(now){
              insertHTML += appendShip(now);
            });
            appendHowToShipBox(insertHTML);
          }else{
            paylater.forEach(function(now){
              insertHTML += appendShip(now);
            });
            appendHowToShipBox(insertHTML);
          }
      }else{
        $('#how-to-ship_wrapper').empty();
      }
    });
  });
});
})