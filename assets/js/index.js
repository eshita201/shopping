

$("#UpdateProduct").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })
    

    var request = {
        "url" : `/api/products/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

})


if(window.location.pathname == "/AllProduct"){

  
  
    $(document).ready(function(){
       
        console.log('Reached in document load');
       
        $(".p-1").click(function(){
            var id = $(this).attr("value")
        //  alert(val);
         

          var request = {
            "url" : `/api/products/${id}`,
            "method" : "DELETE"
           }

            if(confirm("Do you really want to delete this record?")){
                $.ajax(request).done(function(response){
                    alert("Data Deleted Successfully!");
                    location.reload();
                })
            }
        });

        $(".AddtoCart").click(function(event){
            var id = $(this).attr("value")
           

          var request = {
                "url" : `/api/producttocart/${id}`,
                "method" : "POST",
        
            }
        
            if(confirm("Do you really want to add this product to cart?")){
                $.ajax(request).done(function(response){
                alert("Data Added to cart Successfully!");
            })
            }
        });

   });
}

if(window.location.pathname == "/index"){

  
    $(document).ready(function () {
            $(".AddtoCart").click(function(event){
                var id = $(this).attr("value")
            

            var request = {
                    "url" : `/api/producttocart/${id}`,
                    "method" : "POST",
            
                }
            
                if(confirm("Do you really want to add this product to cart?")){
                    $.ajax(request).done(function(response){
                    alert("Data Added to cart Successfully!");
                })
                }
            });  
        });

}