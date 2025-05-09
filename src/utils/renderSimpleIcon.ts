import { h } from 'vue'
import type { FunctionalComponent } from 'vue'
import type { SimpleIcon } from 'simple-icons'

export function renderSimpleIcon(icon: SimpleIcon, size = 16): FunctionalComponent {
    return () =>
        h(
            'svg',
            {
                xmlns: 'http://www.w3.org/2000/svg',
                role: 'img',
                viewBox: '0 0 24 24',
                width: size,
                height: size,
                fill: `#${icon.hex}`,
            },
            [h('path', { d: icon.path })]
        )
}