module.exports = {
  isValidValue: true,
  async compare (value, hashedValue) {
    this.value = value
    this.hashedValue = hashedValue
    return this.isValidValue
  }
}
