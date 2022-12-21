import { ReactComponent as Cart } from 'incart-fe-common/src/icons/Cart.svg'
import { ReactComponent as Bag } from 'incart-fe-common/src/icons/Bag.svg'
import emptyHandImage from 'incart-fe-common/src/images/empty-hand.png'
import { Button, Callout, Text1 } from 'incart-fe-common'
import { useCallback, useEffect, useRef } from 'react'
import autoAnimate from '@formkit/auto-animate'
import { useAtom, useAtomValue } from 'jotai'
import { Vexile } from '@haechi/flexile'
import immer from 'immer'

import { cartAtom, wholePriceAtom } from '@/jotai'
import { CartItem, Plink } from '@/components'
import Styles from './styles'

export default () => {
    const [cart, setCart] = useAtom(cartAtom)
    const wholePrice = useAtomValue(wholePriceAtom)

    const parent = useRef(null)

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent])

    const removeItem = useCallback((index: number) => {
        setCart((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
    }, [])

    const setAmount = useCallback((index: number, amount: number) => {
        setCart((prev) =>
            immer(prev, (_prev) => {
                _prev[index].amount = amount
            })
        )
    }, [])

    if (cart.length === 0) {
        return (
            <Vexile x="center" y="center" gap={12} filly>
                <Text1 center grey5>
                    장바구니가 비어있습니다
                    <br />
                    상품을 추가해보세요
                </Text1>
                <img src={emptyHandImage} />
            </Vexile>
        )
    }

    return (
        <>
            <Callout icon={(style) => <Cart style={style} />}>
                장바구니에 다른 상품을 추가할 수 있습니다
            </Callout>
            <Styles.CartListWrapper ref={parent}>
                {cart.map((item, index) => (
                    <CartItem
                        key={item.product.id + item.selectedOptions.join('/')}
                        setAmount={(amount) => setAmount(index, amount)}
                        item={item}
                        onRemoveItem={() => removeItem(index)}
                    />
                ))}
            </Styles.CartListWrapper>
            <Plink to="/orderer-info" block>
                <Button icon={(style) => <Bag style={style} />}>
                    <span style={{ fontWeight: 'initial' }}>
                        {wholePrice.toLocaleString()}원
                    </span>{' '}
                    구매하기
                </Button>
            </Plink>
        </>
    )
}
