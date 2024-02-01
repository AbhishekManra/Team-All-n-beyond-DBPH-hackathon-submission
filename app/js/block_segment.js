const allIgnoreChildren = function (element) {
    if (element.children.length === 0) {
        return false;
    } else {
        for (const child of element.children) {
            if (ignoredElements.includes(child.tagName.toLowerCase())) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }
};

const shouldIgnoreElement = function (element) {
    const tag = element.tagName.toLowerCase();
    return ignoredElements.includes(tag) || isPixel(element) || !isShown(element);
};

const handleBlockElement = function (element) {
    if (!containsBlockElements(element)) {
        if (allIgnoreChildren(element)) {
            return [];
        } else {
            return getElementArea(element) / winArea > 0.3
                ? element.children.flatMap(segments)
                : [element];
        }
    } else if (containsTextNodes(element)) {
        return [element];
    } else {
        return element.children.flatMap(segments);
    }
};

const handleNonBlockElement = function (element) {
    if (containsBlockElements(element, false)) {
        return element.children.flatMap(segments);
    } else {
        return getElementArea(element) / winArea > 0.3
            ? element.children.flatMap(segments)
            : [element];
    }
};


//creating segments

const segments = function (element) {
    if (!element) {
        return [];
    }

    if (shouldIgnoreElement(element)) {
        return [];
    }

    const tag = element.tagName.toLowerCase();
    if (blockElements.includes(tag)) {
        return handleBlockElement(element);
    } else {
        return handleNonBlockElement(element);
    }
};


