<!-- Generated from catalog/public-products.json. -->
# XBOSS Connect

**Korean business data, connected to your AI and code.**

Explore 214 business products across Korean tax, social insurance, supported bank inquiries, payroll, and marketing data.

**Start for free.** Product requirements and usage terms are shown when you get started.

[Browse every product](PRODUCTS.md) · [Connect your AI](docs/ai-connect.md) · [Use the API](docs/quickstart.md) · [한국어](README.md)

Download this repository as a ZIP, extract it, and open a terminal in its folder. Requires Node.js 22 or newer.

```sh
node bin/xboss.mjs search "세금계산서"
node bin/xboss.mjs search "4대보험"
node bin/xboss.mjs search "마케팅"
node bin/xboss.mjs doctor --anonymous
node bin/xboss.mjs schema payslip-xlsx --anonymous
node bin/xboss.mjs schema payslip-xlsx --anonymous --template
```

Local product search and public connection checks do not require an account.
Use `schema` to inspect one product. `--template` prints required fields with `null` placeholders to fill before execution.
For an actual job, follow the [connection guide](docs/quickstart.md), inspect the tool schema, and supply the required inputs.

This repository contains clients for XBOSS public APIs, examples, and documentation. Institution connections and job processing run on the XBOSS service.

The [catalog](catalog/public-products.json) contains 214 business products and 45 intermediate workflow steps, verified against official public sources on 2026-11-02. Product names are preserved in Korean.

[Official site](https://xboss.biz) · [Developer documentation](https://developer.xdata.kr) · [Help](https://xboss.biz/service-inquiry)

Repository code is available under the [MIT License](LICENSE). Use of the hosted XBOSS service is subject to its own terms.
