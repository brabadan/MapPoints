<template>
    <div>
        <div>
            <button v-for="(point, index) in points" v-on:click="removePoint(index)">
                {{ point.coords }}
            </button>
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
            },
            addPoint(coords) {
                console.dir(this.map);
                const balloon = new ymaps.Placemark(coords, {
                    balloonContentHeader: "Балун метки"
                });
                this.points.push({coords, balloon});
                this.map.geoObjects.add(balloon);
            },
            removePoint(index) {
                console.log('clicked');
                this.map.geoObjects.remove(this.points[index].balloon);
                this.points.splice(index, 1);
            }
        },
        mounted() {
            const handleClick = (e) => {
                this.addPoint(e.get('coords'));
            };

            let map = this.map;

            this.loadJs('https://api-maps.yandex.ru/2.1/?apikey=84058bf3-7dd7-4fb0-a8b6-729d56f01663&lang=ru_RU', () => {
                ymaps.ready(() => {
                    this.map = new ymaps.Map("map", {
                        center: [55.76, 37.64],
                        zoom: 7
                    });

                    this.map.events.add('click', handleClick);
                });

            });
        },
        data() {
            return {
                points: [],
                map: {},
            }
        },
    }

</script>

<style scoped>

</style>
