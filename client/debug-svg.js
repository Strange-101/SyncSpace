import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Go to the workspace page
    await page.goto('http://localhost:5173');

    // Wait for React and Excalidraw to load
    await page.waitForSelector('.excalidraw', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000)); // Give it a moment to render SVGs

    // Find a specific SVG icon (like the hand tool or lock icon)
    const styles = await page.evaluate(() => {
        // Find an SVG inside the toolbars
        const svg = document.querySelector('.excalidraw .ToolIcon__icon svg') || document.querySelector('.excalidraw svg');
        if (!svg) return "No SVG found within .excalidraw";

        const computedStyle = window.getComputedStyle(svg);

        // Get its parent to see if that's the issue
        const parentNode = svg.parentNode;
        const parentStyle = window.getComputedStyle(parentNode);

        return {
            svg: {
                width: computedStyle.width,
                height: computedStyle.height,
                maxWidth: computedStyle.maxWidth,
                maxHeight: computedStyle.maxHeight,
                display: computedStyle.display,
                boxSizing: computedStyle.boxSizing
            },
            parent: {
                tagName: parentNode.tagName,
                className: parentNode.className,
                width: parentStyle.width,
                height: parentStyle.height,
                display: parentStyle.display,
                alignItems: parentStyle.alignItems
            },
            html: svg.outerHTML.substring(0, 150) + '...'
        };
    });

    console.log(JSON.stringify(styles, null, 2));
    await browser.close();
})();
