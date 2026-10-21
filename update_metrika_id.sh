#!/usr/bin/env bash

OLD_ID="113705287"
NEW_ID="113705409"

find . -type f -name "*.html" | while read -r file; do
    # Пропускаем файл подтверждения прав
    if [[ "$file" == *"yandex_"*".html" ]]; then
        echo "Skip (Yandex token file): $file"
        continue
    fi

    # Проверяем, есть ли вообще код Метрики в файле
    if ! grep -q "Yandex.Metrika counter" "$file"; then
        echo "No Metrika code found: $file"
        continue
    fi

    # Заменяем старый ID на новый во всём файле
    awk -v old="$OLD_ID" -v new="$NEW_ID" '{
        gsub(old, new)
        print
    }' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"

    echo "Updated ID in: $file"
done

