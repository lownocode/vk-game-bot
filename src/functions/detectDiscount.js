import YAML from "yaml"
import fs from "fs"

export const config = YAML.parse(
    fs.readFileSync("./data/config.yaml", "utf-8")
)

export const detectDiscount = (num) => {
    const discounts = config.shopDiscounts
    const keys = Object.keys(discounts).sort((a, b) => a - b)
    let closest = keys[0]

    for (let i = 1; i < keys.length; i++) {
        const prevKey = keys[i - 1]
        const currKey = keys[i]

        if (num >= prevKey && num < currKey) {
            closest = num - prevKey < currKey - num ? prevKey : currKey
            break
        }

        else if (num >= currKey) {
            closest = currKey
        }
    }

    return discounts[closest]
}