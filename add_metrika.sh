#!/usr/bin/env bash

COUNTER_CODE=$(cat <<'EOF'
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=113705287', 'ym');

    ym(113705287, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/113705287" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
EOF
)

# Проходимся по всем .html файлам в текущей папке и подпапках
find . -type f -name "*.html" | while read -r file; do
    # Проверяем, нет ли уже кода в файле (чтобы не дублировать)
    if grep -q "Yandex.Metrika counter" "$file"; then
        echo "Already present: $file"
        continue
    fi

    # Вставляем код перед </body>
    sed -i "s|</body>|${COUNTER_CODE}\n</body>|" "$file"
    echo "Added to: $file"
done
