#!/usr/bin/env bash

# Код счётчика (экранированный для безопасного использования)
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

find . -type f -name "*.html" | while read -r file; do
    # Пропускаем файл подтверждения Яндекса, чтобы не ломать его структуру
    if [[ "$file" == *"yandex_"*".html" ]]; then
        echo "Skip (Yandex token file): $file"
        continue
    fi

    # Проверяем, нет ли уже кода
    if grep -q "Yandex.Metrika counter" "$file"; then
        echo "Already present: $file"
        continue
    fi

    # Вставляем код перед </body> с помощью awk (это намного надёжнее sed для HTML)
    awk -v code="$COUNTER_CODE" '
    {
        lines[NR] = $0
    }
    END {
        for (i = 1; i <= NR; i++) {
            if (lines[i] ~ /<\/body>/) {
                # Нашли закрывающий body — печатаем код счётчика перед ним
                print code
            }
            print lines[i]
        }
    }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"

    echo "Added to: $file"
done
