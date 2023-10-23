exports.validateResponseStatus = (status, code) => {
    expect(status).toHaveBeenCalledWith(code);
}

exports.validateResponseJson = (received, expected) => {
    expect(received).toHaveBeenCalledWith(expected);
}