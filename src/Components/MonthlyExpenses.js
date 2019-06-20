import React from 'react';
import { inject } from 'mobx-react';
import { Form, Input, InputNumber, Icon, Button } from 'antd';

let id = 0;

class MonthlyExpenses extends React.Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 24 },
        sm: { span: 16, offset: 8 },
      },
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Expenses' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {})(
          <span>
            <Input placeholder="expense label (optional)" style={{ width: '50%', marginRight: 8 }} onChange={(label) => this.props.onExpenseLabelChange(k, label)} />
            <InputNumber
              placeholder="expense amount"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              precision={0}
              style={{ width: '45%', marginRight: 8 }}
              onChange={(value) => this.props.onExpensePriceChange(k, value)} />
          </span>
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <span>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add}>
            <Icon type="plus" /> Add monthly expense
          </Button>
        </Form.Item >
      </span>
    );
  }
}

export default inject(stores => ({
  onExpensePriceChange: stores.rootStore.investmentStore.onExpensePriceChange,
  onExpenseLabelChange: stores.rootStore.investmentStore.onExpenseLabelChange,
}))(MonthlyExpenses);