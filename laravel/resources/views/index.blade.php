<!DOCTYPE html>
<html>
<head>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @vite('resources/css/parts/card.css')
</head>
<body>
    <div
        id="app"
        data-cards="{{ json_encode($cards) }}"
    ></div>
</body>
</html>
