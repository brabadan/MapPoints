<template>
    <div>
        <div>
            dfcv
        </div>
        <div id="map" style="width: 600px; height: 400px"></div>
    </div>
</template>

<script>
    import $ from 'jquery';  // подключаем jQuery
    export default {
        name: "map",
        methods: {
            loadJs(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'script',
                    success: callback,
                    async: true
                });
            }
        },
        mounted() {
            this.loadJs('https://api-maps.yandex.ru/2.1/?apikey=84058bf3-7dd7-4fb0-a8b6-729d56f01663&lang=ru_RU', function () {
                ymaps.ready(function(){
                    var map = new ymaps.Map("map", {
                        center: [55.76, 37.64],
                        zoom: 7
                    });
                });

            });
        },
    }
</script>

<style scoped>

</style>
