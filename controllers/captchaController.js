import svgCaptcha from 'svg-captcha'

export const getCaptcha = (req, res) => {
    const captcha = svgCaptcha.create({
        size: 7,
        ignoreChars: '0o1i',
        noise: 2,
        color: true,
        background: '#ddd7d7' 
    })

    req.session.captcha = captcha.text;

    res.type('svg')
    res.status(200).send(captcha.data)
}