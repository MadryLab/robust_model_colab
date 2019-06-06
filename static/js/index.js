$(function() {
    var anchorImg = null;
    document.getElementById("loading").style.display = "none";

    function handleClick(e) {
        console.log("Handling click");
        console.log(e.target.id);
        encoded_image = document.getElementById("myCanvas").toDataURL();
	document.getElementById("loading").style.display = "block";
        $.post("https://localhost:{{port}}/toclass", JSON.stringify({
	    "curr_im": encoded_image,
	    "class": parseInt(e.target.id),
            "anchor_im": anchorImg
        }), function(data, stat) {
            logits = data['logits'];
            for(var i = 0; i < logits.length; i++){
                $("#logit-" + i).text(logits[i].toFixed(2));
            }
            var img = new Image();
            img.src = 'data:image/png;base64,' + data['new_image'];
            img.style.imageRendering = 'pixelated';
            img.onload = function() {
                var ctx = document.getElementById("myCanvas").getContext("2d")
                ctx.clearRect(0, 0, 256, 256);
                ctx.drawImage(img, 0, 0, 256, 256);
		document.getElementById("loading").style.display = "none";
            }
        });
    }

    var timeoutId = 0;

    $("#myCanvas").ready(function(e) {
        var ctx = $("#myCanvas").get(0).getContext("2d");
        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(0, 0, 256, 256);

        $(".setanchor").on('click', function(e) {
            anchorImg = document.getElementById("myCanvas").toDataURL();
        });

        $(".resetanchor").on('click', function(e) {
            anchorImg = null;
        });

        $(".classbutton").on('mousedown', function(e) {
            timeoutId = setInterval(function(){ handleClick(e); }, 250);
        }).on('mouseup mouseleave', function() {
            clearTimeout(timeoutId);
        }).on('click', function(e) {
            handleClick(e);
        });
    });
});
